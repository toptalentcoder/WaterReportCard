import express from 'express';
import serverless from 'serverless-http';
import authRoute from './routes/auth-route.ts';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/auth', authRoute);

// Export Lambda-compatible handler
export const handler = serverless(app);
