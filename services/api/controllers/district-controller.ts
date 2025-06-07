import { db } from '../../../libs/shared/types/db.ts'
import { Request, Response } from 'express'
/**
 * GET /districts
 * Returns a list of districts (protected by RBAC)
 */
export async function getDistricts(req: Request, res: Response) {
    try {
        const result = await db.query('SELECT id, name, region FROM districts')
        res.json(result.rows)
    } catch (err) {
        console.error('Error fetching districts:', err)
        res.status(500).json({ error: 'Internal Server Error' })
    }
} 