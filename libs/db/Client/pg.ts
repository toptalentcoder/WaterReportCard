import { Pool } from 'pg';
import dotenv from 'dotenv';
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

dotenv.config();

let cachedPassword: string | undefined;
let pool: Pool | null = null;
let secretsManager: SecretsManagerClient | null = null;

async function getDatabasePassword(): Promise<string> {
    // If we're not in AWS, use the local password
    if (!process.env.AWS_REGION) {
        return process.env.POSTGRES_PASSWORD || '';
    }

    if (cachedPassword) return cachedPassword;

    if (!secretsManager) {
        secretsManager = new SecretsManagerClient({ 
            region: process.env.AWS_REGION,
            maxAttempts: 3 // Limit retry attempts
        });
    }

    const secretArn = process.env.POSTGRES_SECRET_ARN;
    if (!secretArn) {
        throw new Error('POSTGRES_SECRET_ARN is required in AWS environment');
    }

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

async function createPool(): Promise<Pool> {
    if (pool) return pool;

    const password = await getDatabasePassword();
    
    pool = new Pool({
        host: process.env.POSTGRES_HOST,
        port: parseInt(process.env.POSTGRES_PORT || '5432'),
        user: process.env.POSTGRES_USER,
        password: password,
        database: process.env.POSTGRES_DB,
        // Optimized connection pool settings
        max: 1, // Lambda functions should use a single connection
        min: 0, // Allow the connection to be closed when not in use
        idleTimeoutMillis: 1000, // Close idle connections after 1 second
        connectionTimeoutMillis: 5000, // Reduced connection timeout to 5 seconds
        // SSL configuration for RDS
        ssl: process.env.AWS_REGION ? {
            rejectUnauthorized: false // Required for RDS SSL
        } : undefined,
        // Performance optimizations
        keepAlive: true,
        keepAliveInitialDelayMillis: 1000,
        application_name: 'waterreportcard',
        statement_timeout: 5000, // 5 seconds timeout for queries
        query_timeout: 5000, // 5 seconds timeout for queries
    });

    // Handle connection errors
    pool.on('error', (err) => {
        console.error('Unexpected error on idle client', err);
        pool = null; // Reset pool on error to force recreation
    });

    // Handle connection timeouts
    pool.on('connect', (client) => {
        client.on('error', (err) => {
            console.error('Client error:', err);
            pool = null; // Reset pool on error to force recreation
        });
    });

    return pool;
}

// Export a function to get a database connection
export async function getDb(): Promise<Pool> {
    try {
        return await createPool();
    } catch (error) {
        console.error('Failed to create database pool:', error);
        throw error;
    }
}

// For backward compatibility
export const db = {
    query: async (text: string, params?: any[]) => {
        const pool = await getDb();
        return pool.query(text, params);
    },
    end: async () => {
        if (pool) {
            await pool.end();
            pool = null;
        }
    }
};