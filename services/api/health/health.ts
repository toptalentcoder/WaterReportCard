import { Request, Response } from 'express';

export const getHealth = async (_: Request, res: Response) => {
    try {
        // ping DB or other service if needed
        res.json({ health: 'healthy' });
    } catch (e) {
        res.status(500).json({ error: 'unhealthy' });
    }
};
  