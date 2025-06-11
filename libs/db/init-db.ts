import { getDb } from './Client/pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

async function initDb() {
  console.log('Initializing database with the following configuration:');
  console.log('Host:', process.env.POSTGRES_HOST);
  console.log('Port:', process.env.POSTGRES_PORT);
  console.log('Database:', process.env.POSTGRES_DB);
  console.log('User:', process.env.POSTGRES_USER);
  
  const db = await getDb();
  
  try {
    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    console.log('Executing schema...');
    await db.query(schema);
    console.log('Schema created successfully');

    // Seed initial data
    console.log('Seeding initial data...');
    await db.query(`INSERT INTO roles (name) VALUES ('Admin'), ('QA') ON CONFLICT DO NOTHING`);
    await db.query(`INSERT INTO permissions (name) VALUES ('view:districts'), ('edit:districts'), ('admin:access') ON CONFLICT DO NOTHING`);
    await db.query(`
      INSERT INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id FROM roles r, permissions p
      WHERE (r.name = 'Admin' AND p.name IN ('view:districts', 'edit:districts', 'admin:access'))
         OR (r.name = 'QA' AND p.name = 'view:districts')
      ON CONFLICT DO NOTHING
    `);
    console.log('Initial data seeded successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await db.end();
  }
}

// Run if this file is executed directly
if (require.main === module) {
  // Validate required environment variables
  const requiredEnvVars = [
    'POSTGRES_HOST',
    'POSTGRES_PORT',
    'POSTGRES_DB',
    'POSTGRES_USER'
  ];

  // Only require AWS-related variables if we're in AWS
  if (process.env.AWS_REGION) {
    requiredEnvVars.push('POSTGRES_SECRET_ARN');
  } else {
    // For local development, require password
    requiredEnvVars.push('POSTGRES_PASSWORD');
  }

  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingEnvVars.length > 0) {
    console.error('Missing required environment variables:', missingEnvVars.join(', '));
    process.exit(1);
  }

  initDb().catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  });
}

export { initDb }; 