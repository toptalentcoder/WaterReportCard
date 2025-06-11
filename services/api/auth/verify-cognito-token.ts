import jwksClient from 'jwks-rsa';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { syncUserFromCognito } from '../../../libs/db/models/user'
import { error } from 'console';

declare global {
    namespace Express {
        interface Request {
        user?: any;
        }
    }
}

const region = 'us-west-2';
const userPoolId = process.env.COGNITO_USER_POOL_ID;
const clientId = process.env.COGNITO_CLIENT_ID;

const client = jwksClient({
    jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
    client.getSigningKey(header.kid!, (err, key) => {
        const signingKey = key?.getPublicKey();
        callback(err, signingKey);
    });
}

export function verifyCognitoToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Missing token' });
        return;
    }
  
    jwt.verify(token, getKey, {
        audience: clientId,
        issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
    }, async (err, decoded: any) => {
        if (err) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
    
        try {
            await syncUserFromCognito(decoded.sub, decoded.email);
            req.user = decoded;
            next();
        } catch (e) {
            console.error('Sync error:', e);
            res.status(500).json({ error: 'User sync failed' });
        }
    });
}