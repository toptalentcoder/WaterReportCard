import { Request, Response } from 'express';
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { syncUserFromCognito } from '../../../libs/db/models/user';

const region = process.env.AWS_REGION!;
const userPoolId = process.env.COGNITO_POOL_ID!;
const clientId = process.env.COGNITO_CLIENT_ID!;

const cognito = new CognitoIdentityProviderClient({ region });

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    const command = new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [{ Name: 'email', Value: email }],
    });

    await cognito.send(command);
    res.status(200).json({ message: 'Sign-up successful. Please confirm via email (if required).' });
  } catch (err) {
    console.error('Sign-up error:', err);
    res.status(400).json({ error: (err as Error).message });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    const result = await cognito.send(command);
    const idToken = result.AuthenticationResult?.IdToken;
    if (!idToken) throw new Error('Missing idToken');
    
    const decoded = parseJwt(idToken!);
    await syncUserFromCognito(decoded.sub, decoded.email);

    res.status(200).json({
      message: 'Sign-in successful',
      idToken,
      accessToken: result.AuthenticationResult?.AccessToken,
    });
  } catch (err) {
    console.error('Sign-in error:', err);
    res.status(400).json({ error: (err as Error).message });
  }
};

function parseJwt(token: string): { sub: string; email: string } {
  const [, payload] = token.split('.');
  const decoded = Buffer.from(payload, 'base64').toString('utf-8');
  return JSON.parse(decoded);
}
