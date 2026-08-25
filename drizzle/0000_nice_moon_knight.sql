CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`kicker` text DEFAULT '' NOT NULL,
	`category` text DEFAULT 'Strategy' NOT NULL,
	`author` text DEFAULT 'Al Trellis' NOT NULL,
	`date` text DEFAULT '' NOT NULL,
	`cover` text DEFAULT '' NOT NULL,
	`pdf` text DEFAULT '' NOT NULL,
	`body` text DEFAULT '' NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);