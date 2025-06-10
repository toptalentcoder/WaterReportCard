import { Request, Response } from 'express';

export const getVersion = (_: Request, res: Response) => {
    res.json({ version: '1.0.0', commit: process.env.GIT_COMMIT || 'dev' });
};
  