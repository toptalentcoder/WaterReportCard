import { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      // Cognito signup logic
      res.status(200).json({ message: 'Signup successful' });
    } catch (err: unknown) {
      console.error(err);
      res.status(400).json({ error: err instanceof Error ? err.message : 'An error occurred' });
    }
};

export const signin = async (req: Request, res: Response) => {
    try{
        const { email, password } = req.body;
        // Cognito signin logic
        res.status(200).json({ message: 'Signin successful' });
    } catch (err: unknown) {
        console.error(err);
        res.status(400).json({ error: err instanceof Error ? err.message : 'An error occurred' });
    }
};
  