import { Request, Response } from 'express';
import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    ConfirmSignUpCommand,
    AuthFlowType,
} from '@aws-sdk/client-cognito-identity-provider';
import { syncUserFromCognito } from '../../../libs/db/models/user';

const region = process.env.AWS_REGION!;
const userPoolId = process.env.COGNITO_POOL_ID!;
const clientId = process.env.COGNITO_CLIENT_ID!;

const cognito = new CognitoIdentityProviderClient({ region });

export const signup = async (req: Request, res: Response) => {
  const { email, password, firstName, lastName, role } = req.body;
  
  // Log the incoming request body for debugging
  console.log('Signup request body:', { email, firstName, lastName, role });

  if (!email || !password || !firstName || !lastName || !role) {
    console.log('Missing fields:', { email: !!email, password: !!password, firstName: !!firstName, lastName: !!lastName, role: !!role });
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const command = new SignUpCommand({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'given_name', Value: firstName },
        { Name: 'family_name', Value: lastName },
        { Name: 'nickname', Value: role }
      ],
    });

    await cognito.send(command);
    res.status(200).json({ message: 'Sign-up successful. Please confirm via email (if required).' });
  } catch (err) {
    console.error('Sign-up error:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
    res.status(400).json({ error: errorMessage });
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing email or password' });

  try {
    // Validate environment variables
    if (!region || !userPoolId || !clientId) {
      throw new Error('Missing required environment variables: AWS_REGION, COGNITO_POOL_ID, or COGNITO_CLIENT_ID');
    }

    console.log('Attempting to authenticate with Cognito...', {
      region,
      userPoolId,
      clientId,
      email
    });

    const command = new InitiateAuthCommand({
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: clientId,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    });

    console.log('Sending authentication request...');
    const response = await cognito.send(command);
    console.log('Authentication successful, processing tokens...');

    if (!response.AuthenticationResult) {
      throw new Error('No authentication result received');
    }

    const { IdToken, AccessToken, RefreshToken } = response.AuthenticationResult;
    
    if (!IdToken) {
      throw new Error('No ID token received');
    }

    try {
      const decoded = parseJwt(IdToken);
      console.log('Syncing user with database...');
      await syncUserFromCognito(decoded.sub, decoded.email);
      console.log('User sync completed successfully');
    } catch (syncError) {
      console.error('Database sync error:', syncError);
      // Continue with signin even if sync fails
    }

    res.status(200).json({
      message: 'Sign-in successful',
      idToken: IdToken,
      accessToken: AccessToken,
      refreshToken: RefreshToken,
    });

  } catch (err: any) {
    console.error('Sign-in error:', err);
    
    // Handle specific Cognito errors
    if (err.name === 'UserNotConfirmedException') {
      res.status(400).json({ error: 'Please confirm your email before signing in' });
    } else if (err.name === 'NotAuthorizedException') {
      res.status(401).json({ error: 'Incorrect email or password' });
    } else if (err.name === 'UserNotFoundException') {
      res.status(404).json({ error: 'User does not exist' });
    } else {
      res.status(500).json({ 
        error: 'Authentication failed',
        details: err.message
      });
    }
  }
};

export const confirmSignup = async (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) return res.status(400).json({ error: 'Missing email or verification code' });

  try {
    const command = new ConfirmSignUpCommand({
      ClientId: clientId,
      Username: email,
      ConfirmationCode: code,
    });

    await cognito.send(command);
    res.status(200).json({ message: 'Email verification successful. You can now sign in.' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(400).json({ error: (err as Error).message });
  }
};

function parseJwt(token: string): { sub: string; email: string } {
  const [, payload] = token.split('.');
  const decoded = Buffer.from(payload, 'base64').toString('utf-8');
  return JSON.parse(decoded);
}
