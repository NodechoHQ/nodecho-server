import { FactoryProvider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Database from 'better-sqlite3';
import {
  BetterSQLite3Database,
  drizzle,
} from 'drizzle-orm/better-sqlite3/driver';
import * as schema from './schema';
import { Env } from 'src/env.schema';

export const kDatabaseProvider = 'DATABASE_CONNECTION';
export type DatabaseProvider = BetterSQLite3Database<typeof schema>;

export const databaseProvider: FactoryProvider = {
  provide: kDatabaseProvider,
  inject: [ConfigService],
  useFactory: (configService: ConfigService<Env>): DatabaseProvider => {
    const DATABASE_URL = configService.get('DATABASE_URL', { infer: true })!;
    const sqlite = new Database(DATABASE_URL);
    return drizzle(sqlite, { schema });
  },
};
