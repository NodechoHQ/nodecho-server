import { randomUUID } from 'node:crypto';
import { relations } from 'drizzle-orm';
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// MARK: - Users

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerifiedAt: integer('email_verified_at', {
    mode: 'timestamp',
  }),
  lastVerifyingEmailAt: integer('last_verifying_email_at', {
    mode: 'timestamp',
  }),
  passwordHash: text('password_hash').notNull(),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const usersRelations = relations(users, ({ many }) => ({
  servers: many(servers),
}));

// MARK: - Servers

export const servers = sqliteTable('servers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  token: text('token')
    .notNull()
    .unique()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  ownerId: integer('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Data loss Notification
  dataLossAlertEnabled: integer('data_loss_alert_enabled', {
    mode: 'boolean',
  }).notNull(),
  missedDataThreshold: integer('missed_data_threshold').notNull(),
  additionalPingCheckEnabled: integer('additional_ping_check_enabled', {
    mode: 'boolean',
  }).notNull(),

  // Resource Usage Notification
  resourceUsageAlertEnabled: integer('resource_usage_alert_enabled', {
    mode: 'boolean',
  }).notNull(),
  systemLoadThreshold: integer('system_load_threshold').notNull(),
  ramUsageThreshold: integer('ram_usage_threshold').notNull(),
  diskUsageThreshold: integer('disk_usage_threshold').notNull(),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const serversRelations = relations(servers, ({ one, many }) => ({
  owner: one(users, {
    fields: [servers.ownerId],
    references: [users.id],
  }),
  metrics: many(metrics),
}));

// MARK: - Metrics

export const metrics = sqliteTable('metrics', {
  id: integer('id').primaryKey({ autoIncrement: true }),

  // Belongs to Server
  serverId: integer('server_id')
    .notNull()
    .references(() => servers.id, { onDelete: 'cascade' }),

  // Agent Metadata
  version: text('version').notNull(),

  // OS
  uptime: integer('uptime').notNull(),
  sessions: text('sessions').notNull(),
  processes: text('processes').notNull(),
  processesArray: text('processes_array').notNull(),
  fileHandles: text('file_handles').notNull(),
  fileHandlesLimit: text('file_handles_limit').notNull(),
  osKernel: text('os_kernel').notNull(),
  osName: text('os_name').notNull(),
  osArch: text('os_arch').notNull(),

  // Hardware
  cpuName: text('cpu_name').notNull(),
  cpuCores: text('cpu_cores').notNull(),
  cpuFreq: text('cpu_freq').notNull(),
  ramTotal: integer('ram_total').notNull(),
  ramUsage: integer('ram_usage').notNull(),
  swapTotal: integer('swap_total').notNull(),
  swapUsage: integer('swap_usage').notNull(),
  diskArray: text('disk_array').notNull(),
  diskTotal: integer('disk_total').notNull(),
  diskUsage: integer('disk_usage').notNull(),
  load: text('load').notNull(),
  loadCPU: text('load_cpu').notNull(),
  loadIO: text('load_io').notNull(),

  // Network
  connections: integer('connections').notNull(),
  nic: text('nic').notNull(),
  ipv4: text('ipv4').notNull(),
  ipv6: text('ipv6').notNull(),
  rx: integer('rx').notNull(),
  tx: integer('tx').notNull(),
  rxGap: integer('rx_gap').notNull(),
  txGap: integer('tx_gap').notNull(),
  pingEU: real('ping_eu').notNull(),
  pingUS: real('ping_us').notNull(),
  pingAS: real('ping_as').notNull(),

  // Timestamps
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const metricsRelations = relations(metrics, ({ one }) => ({
  server: one(servers, {
    fields: [metrics.serverId],
    references: [servers.id],
  }),
}));
