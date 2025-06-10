import { db } from '../Client/pg';

export async function seed() {
  await db.query(`INSERT INTO roles (name) VALUES ('Admin'), ('QA') ON CONFLICT DO NOTHING`);
  await db.query(`INSERT INTO permissions (name) VALUES ('view:districts'), ('edit:districts'), ('admin:access') ON CONFLICT DO NOTHING`);
  await db.query(`
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT r.id, p.id FROM roles r, permissions p
    WHERE (r.name = 'Admin' AND p.name IN ('view:districts', 'edit:districts', 'admin:access'))
       OR (r.name = 'QA' AND p.name = 'view:districts')
    ON CONFLICT DO NOTHING
  `);
  console.log('Seeded roles and permissions');
  await db.end();
}

seed();