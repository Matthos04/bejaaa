CREATE TABLE `cafes` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`updated_at` text NOT NULL
);

--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`cafe_id` text NOT NULL,
	`name` text NOT NULL,
	`rating` integer NOT NULL,
	`body` text NOT NULL,
	`purpose` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`author_id` text,
	`fingerprint` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`cafe_id`) REFERENCES `cafes`(`id`) ON UPDATE no action ON DELETE no action
);

--> statement-breakpoint
CREATE INDEX `reviews_cafe_status` ON `reviews` (`cafe_id`,`status`);
--> statement-breakpoint
CREATE INDEX `reviews_rate_limit` ON `reviews` (`fingerprint`,`created_at`);
