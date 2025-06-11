import express from 'express';
import serverless from 'serverless-http';
import authRoute from './routes/auth-route';
import districtRoute from './routes/district-route';
import systemRoute from './routes/system-route';
import dotenv from 'dotenv';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

dotenv.config();

const clientId = process.env.COGNITO_CLIENT_ID;
if (!clientId) throw new Error('Missing env: COGNITO_CLIENT_ID');

const app = express();

// Configure body parsing
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authRoute);
app.use('/districts', districtRoute);
app.use('/', systemRoute);

// Export for Lambda
export const handler = serverless(app, {
  request: (request: express.Request, event: APIGatewayProxyEvent, context: Context) => {
    // Ensure request body is parsed for API Gateway
    if (event.body) {
      try {
        request.body = JSON.parse(event.body);
      } catch (e) {
        request.body = event.body;
      }
    }
  }
});

// Optional: run locally if not in Lambda
if (process.env.NODE_ENV !== 'lambda') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`);
  });
}
