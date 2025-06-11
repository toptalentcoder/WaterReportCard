import { db } from '../Client/pg';
import { getRoleIdByName } from './role';

export async function syncUserFromCognito(userId: string, email: string, roleName = 'QA') {
    try {
        // Use a single query with UPSERT to handle both insert and update cases
        const roleId = await getRoleIdByName(roleName);
        await db.query(`
            INSERT INTO users (id, email, role_id)
            VALUES ($1, $2, $3)
            ON CONFLICT (id) DO UPDATE
            SET email = EXCLUDED.email,
                role_id = EXCLUDED.role_id
            WHERE users.email IS DISTINCT FROM EXCLUDED.email
               OR users.role_id IS DISTINCT FROM EXCLUDED.role_id
        `, [userId, email, roleId]);
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