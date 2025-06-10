import { db } from '../Client/pg';

export async function getRoleIdByName(name: string): Promise<number> {
    const res = await db.query('SELECT id FROM roles WHERE name = $1', [name]);
    if (!res.rows[0]) throw new Error(`Role ${name} not found`);
    return res.rows[0].id;
}