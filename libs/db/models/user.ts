import { db } from '../Client/pg';
import { getRoleIdByName } from './role';

export async function syncUserFromCognito(userId: string, email: string, roleName = 'QA') {
    const found = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (found?.rowCount && found.rowCount > 0) return;
    const roleId = await getRoleIdByName(roleName);
    await db.query('INSERT INTO users (id, email, role_id) VALUES ($1, $2, $3)', [userId, email, roleId]);
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