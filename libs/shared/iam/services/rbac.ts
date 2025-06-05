import { db } from '../../types/db'
import { Permission } from '../enums/permissions'

export async function getUserPermissions(userId: string): Promise<Permission[]> {
    const { rows } = await db.query(`
        SELECT p.name FROM permissions p
        JOIN role_permissions rp ON rp.permission_id = p.id
        JOIN user_roles ur ON ur.role_id = rp.role_id
        WHERE ur.user_id = $1
    `, [userId])

    return rows.map((r: { name: Permission }) => r.name)
}

export async function hasPermission(userId: string, required: Permission): Promise<boolean> {
    const perms = await getUserPermissions(userId)
    return perms.includes(required)
}
