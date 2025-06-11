import { db } from '../Client/pg';
import { getRoleIdByName } from './role';

// Cache for role IDs to avoid repeated database queries
const roleIdCache: { [key: string]: number } = {};

async function getRoleIdWithCache(roleName: string): Promise<number> {
    if (roleIdCache[roleName]) {
        return roleIdCache[roleName];
    }

    const roleId = await getRoleIdByName(roleName);
    roleIdCache[roleName] = roleId;
    return roleId;
}

async function retryOperation<T>(operation: () => Promise<T>, maxRetries: number = 2): Promise<T> {
    let lastError: Error | undefined;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            return await operation();
        } catch (error) {
            lastError = error as Error;
            console.error(`Attempt ${attempt} failed:`, error);
            
            if (attempt < maxRetries) {
                // Shorter backoff: 100ms, 200ms
                const delay = Math.pow(2, attempt - 1) * 100;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}

export async function syncUserFromCognito(userId: string, email: string, roleName = 'QA') {
    try {
        // Use retry logic for database operations with shorter timeouts
        await retryOperation(async () => {
            const roleId = await getRoleIdWithCache(roleName);
            await db.query(`
                INSERT INTO users (id, email, role_id)
                VALUES ($1, $2, $3)
                ON CONFLICT (id) DO UPDATE
                SET email = EXCLUDED.email,
                    role_id = EXCLUDED.role_id
                WHERE users.email IS DISTINCT FROM EXCLUDED.email
                   OR users.role_id IS DISTINCT FROM EXCLUDED.role_id
            `, [userId, email, roleId]);
        });
    } catch (error) {
        console.error('Error syncing user:', error);
        // Don't throw the error, just log it and continue
        // This prevents the signin from failing if the sync fails
    }
}

export async function getUserPermissions(userId: string): Promise<string[]> {
    const res = await db.query(`
        SELECT p.name FROM permissions p
        JOIN role_permissions rp ON rp.permission_id = p.id
        JOIN users u ON u.role_id = rp.role_id
        WHERE u.id = $1
    `, [userId]);
    return res.rows.map(r => r.name);
}