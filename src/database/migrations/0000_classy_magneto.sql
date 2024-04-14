CREATE TABLE `metrics` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`server_id` integer NOT NULL,
	`version` text NOT NULL,
	`uptime` integer NOT NULL,
	`sessions` text NOT NULL,
	`processes` text NOT NULL,
	`processes_array` text NOT NULL,
	`file_handles` text NOT NULL,
	`file_handles_limit` text NOT NULL,
	`os_kernel` text NOT NULL,
	`os_name` text NOT NULL,
	`os_arch` text NOT NULL,
	`cpu_name` text NOT NULL,
	`cpu_cores` text NOT NULL,
	`cpu_freq` text NOT NULL,
	`ram_total` integer NOT NULL,
	`ram_usage` integer NOT NULL,
	`swap_total` integer NOT NULL,
	`swap_usage` integer NOT NULL,
	`disk_array` text NOT NULL,
	`disk_total` integer NOT NULL,
	`disk_usage` integer NOT NULL,
	`load` text NOT NULL,
	`load_cpu` text NOT NULL,
	`load_io` text NOT NULL,
	`connections` integer NOT NULL,
	`nic` text NOT NULL,
	`ipv4` text NOT NULL,
	`ipv6` text NOT NULL,
	`rx` integer NOT NULL,
	`tx` integer NOT NULL,
	`rx_gap` integer NOT NULL,
	`tx_gap` integer NOT NULL,
	`ping_eu` real NOT NULL,
	`ping_us` real NOT NULL,
	`ping_as` real NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`server_id`) REFERENCES `servers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `servers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`token` text NOT NULL,
	`name` text NOT NULL,
	`owner_id` integer NOT NULL,
	`data_loss_alert_enabled` integer NOT NULL,
	`missed_data_threshold` integer NOT NULL,
	`additional_ping_check_enabled` integer NOT NULL,
	`resource_usage_alert_enabled` integer NOT NULL,
	`system_load_threshold` integer NOT NULL,
	`ram_usage_threshold` integer NOT NULL,
	`disk_usage_threshold` integer NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`owner_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified_at` integer,
	`last_verifying_email_at` integer,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `servers_token_unique` ON `servers` (`token`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);