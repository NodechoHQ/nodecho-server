import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  driver: 'better-sqlite',
  out: 'src/database/migrations',
  schema: 'src/database/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL ?? 'sqlite.db',
  },
  verbose: true,
  strict: true,
});
