import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Lazy initialization — only connects when a SaaS route actually
// queries the database.  The core prediction app never touches the
// DB, so DATABASE_URL is not required to deploy.
function createDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  const client = postgres(connectionString, { prepare: false });
  return drizzle(client, { schema });
}

type DbType = ReturnType<typeof createDb>;

export const db = new Proxy({} as DbType, {
  get(_target, prop, receiver) {
    return Reflect.get(createDb(), prop, receiver);
  },
});

export type Database = DbType;
