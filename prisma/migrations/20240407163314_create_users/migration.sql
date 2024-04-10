-- CreateTable
CREATE TABLE "users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "email_verified_at" DATETIME,
    "last_verifying_email_at" DATETIME,
    "password_hash" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_servers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" INTEGER NOT NULL DEFAULT 1,
    "data_loss_alert_enabled" BOOLEAN NOT NULL,
    "missed_data_threshold" INTEGER NOT NULL,
    "additional_ping_check_enabled" BOOLEAN NOT NULL,
    "resource_usage_alert_enabled" BOOLEAN NOT NULL,
    "system_load_threshold" INTEGER NOT NULL,
    "ram_usage_threshold" INTEGER NOT NULL,
    "disk_usage_threshold" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "servers_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_servers" ("additional_ping_check_enabled", "created_at", "data_loss_alert_enabled", "disk_usage_threshold", "id", "missed_data_threshold", "name", "ram_usage_threshold", "resource_usage_alert_enabled", "system_load_threshold", "token", "updated_at") SELECT "additional_ping_check_enabled", "created_at", "data_loss_alert_enabled", "disk_usage_threshold", "id", "missed_data_threshold", "name", "ram_usage_threshold", "resource_usage_alert_enabled", "system_load_threshold", "token", "updated_at" FROM "servers";
DROP TABLE "servers";
ALTER TABLE "new_servers" RENAME TO "servers";
CREATE UNIQUE INDEX "servers_token_key" ON "servers"("token");
CREATE TABLE "new_metrics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "server_id" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "uptime" BIGINT NOT NULL,
    "sessions" TEXT NOT NULL,
    "processes" TEXT NOT NULL,
    "processes_array" TEXT NOT NULL,
    "file_handles" TEXT NOT NULL,
    "file_handles_limit" TEXT NOT NULL,
    "os_kernel" TEXT NOT NULL,
    "os_name" TEXT NOT NULL,
    "os_arch" TEXT NOT NULL,
    "cpu_name" TEXT NOT NULL,
    "cpu_cores" TEXT NOT NULL,
    "cpu_freq" TEXT NOT NULL,
    "ram_total" BIGINT NOT NULL,
    "ram_usage" BIGINT NOT NULL,
    "swap_total" BIGINT NOT NULL,
    "swap_usage" BIGINT NOT NULL,
    "disk_array" TEXT NOT NULL,
    "disk_total" BIGINT NOT NULL,
    "disk_usage" BIGINT NOT NULL,
    "load" TEXT NOT NULL,
    "load_cpu" TEXT NOT NULL,
    "load_io" TEXT NOT NULL,
    "connections" BIGINT NOT NULL,
    "nic" TEXT NOT NULL,
    "ipv4" TEXT NOT NULL,
    "ipv6" TEXT NOT NULL,
    "rx" BIGINT NOT NULL,
    "tx" BIGINT NOT NULL,
    "rx_gap" BIGINT NOT NULL,
    "tx_gap" BIGINT NOT NULL,
    "ping_eu" REAL NOT NULL,
    "ping_us" REAL NOT NULL,
    "ping_as" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "metrics_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_metrics" ("connections", "cpu_cores", "cpu_freq", "cpu_name", "created_at", "disk_array", "disk_total", "disk_usage", "file_handles", "file_handles_limit", "id", "ipv4", "ipv6", "load", "load_cpu", "load_io", "nic", "os_arch", "os_kernel", "os_name", "ping_as", "ping_eu", "ping_us", "processes", "processes_array", "ram_total", "ram_usage", "rx", "rx_gap", "server_id", "sessions", "swap_total", "swap_usage", "tx", "tx_gap", "updated_at", "uptime", "version") SELECT "connections", "cpu_cores", "cpu_freq", "cpu_name", "created_at", "disk_array", "disk_total", "disk_usage", "file_handles", "file_handles_limit", "id", "ipv4", "ipv6", "load", "load_cpu", "load_io", "nic", "os_arch", "os_kernel", "os_name", "ping_as", "ping_eu", "ping_us", "processes", "processes_array", "ram_total", "ram_usage", "rx", "rx_gap", "server_id", "sessions", "swap_total", "swap_usage", "tx", "tx_gap", "updated_at", "uptime", "version" FROM "metrics";
DROP TABLE "metrics";
ALTER TABLE "new_metrics" RENAME TO "metrics";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
