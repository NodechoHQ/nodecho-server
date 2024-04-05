-- CreateTable
CREATE TABLE "servers" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "token" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data_loss_alert_enabled" BOOLEAN NOT NULL,
    "missed_data_threshold" INTEGER NOT NULL,
    "additional_ping_check_enabled" BOOLEAN NOT NULL,
    "resource_usage_alert_enabled" BOOLEAN NOT NULL,
    "system_load_threshold" INTEGER NOT NULL,
    "ram_usage_threshold" INTEGER NOT NULL,
    "disk_usage_threshold" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "metrics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "server_id" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "uptime" INTEGER NOT NULL,
    "sessions" INTEGER NOT NULL,
    "processes" INTEGER NOT NULL,
    "processes_array" TEXT NOT NULL,
    "file_handles" INTEGER NOT NULL,
    "file_handles_limit" INTEGER NOT NULL,
    "os_kernel" TEXT NOT NULL,
    "os_name" TEXT NOT NULL,
    "os_arch" TEXT NOT NULL,
    "cpu_name" TEXT NOT NULL,
    "cpu_cores" INTEGER NOT NULL,
    "cpu_freq" REAL NOT NULL,
    "ram_total" INTEGER NOT NULL,
    "ram_usage" INTEGER NOT NULL,
    "swap_total" INTEGER NOT NULL,
    "swap_usage" INTEGER NOT NULL,
    "disk_array" TEXT NOT NULL,
    "disk_total" INTEGER NOT NULL,
    "disk_usage" INTEGER NOT NULL,
    "load" TEXT NOT NULL,
    "load_cpu" REAL NOT NULL,
    "load_io" REAL NOT NULL,
    "connections" INTEGER NOT NULL,
    "nic" TEXT NOT NULL,
    "ipv4" TEXT NOT NULL,
    "ipv6" TEXT NOT NULL,
    "rx" INTEGER NOT NULL,
    "tx" INTEGER NOT NULL,
    "rx_gap" INTEGER NOT NULL,
    "tx_gap" INTEGER NOT NULL,
    "ping_eu" REAL NOT NULL,
    "ping_us" REAL NOT NULL,
    "ping_as" REAL NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "metrics_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "servers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "servers_token_key" ON "servers"("token");
