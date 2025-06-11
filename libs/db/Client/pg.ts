import { Pool } from 'pg';
import dotenv from 'dotenv';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

dotenv.config();

function required(key: string): string {
    const val = process.env[key];
    if (!val) throw new Error(`Missing env var: ${key}`);
    return val;
}

let cachedPassword: string | undefined;

async function getDatabasePassword(): Promise<string> {
    if (cachedPassword) return cachedPassword;

    const secretsManager = new SecretsManagerClient({ region: process.env.AWS_REGION });
    const secretArn = required('POSTGRES_SECRET_ARN');

    try {
        const command = new GetSecretValueCommand({ SecretId: secretArn });
        const response = await secretsManager.send(command);
        const secretString = response.SecretString;
        
        if (!secretString) {
            throw new Error('No secret string found in the secret');
        }

        const secret = JSON.parse(secretString);
        cachedPassword = secret.password;
        if (!cachedPassword) {
            throw new Error('No password found in the secret');
        }
        return cachedPassword;
    } catch (error) {
        console.error('Error fetching database password:', error);
        throw error;
    }
}

// Optimize connection pool for Lambda environment
export const db = new Pool({
    host: required('POSTGRES_HOST'),
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: required('POSTGRES_USER'),
    password: process.env.POSTGRES_PASSWORD || '', // Will be updated after fetching from Secrets Manager
    database: required('POSTGRES_DB'),
    // Connection pool settings
    max: 1, // Lambda functions should use a single connection
    min: 0, // Allow the connection to be closed when not in use
    idleTimeoutMillis: 1000, // Close idle connections after 1 second
    connectionTimeoutMillis: 5000, // Connection timeout after 5 seconds
    // SSL configuration for RDS
    ssl: {
        rejectUnauthorized: false // Required for RDS SSL
    }
});

// Initialize the database connection with the password from Secrets Manager
(async () => {
    try {
        const password = await getDatabasePassword();
        db.options.password = password;
    } catch (error) {
        console.error('Failed to initialize database connection:', error);
        throw error;
    }
})();

// Handle connection errors
db.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Handle connection timeouts
db.on('connect', (client) => {
    client.on('error', (err) => {
        console.error('Client error:', err);
    });
});