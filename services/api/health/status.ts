import { Request, Response } from 'express';

export const getStatus = (_: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
};
  