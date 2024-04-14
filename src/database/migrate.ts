import 'dotenv/config';
import Database from 'better-sqlite3';
import * as schema from './schema';
import { drizzle } from 'drizzle-orm/better-sqlite3/driver';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';

const sqlite = new Database(process.env.DATABASE_URL ?? 'sqlite.db');
const db = drizzle(sqlite, { schema });

migrate(db, { migrationsFolder: 'database' });

sqlite.close();
