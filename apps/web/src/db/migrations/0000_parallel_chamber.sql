CREATE TABLE IF NOT EXISTS "items" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"created_by" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tallies" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"item_id" varchar(32) NOT NULL,
	"created_by" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(32) PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"created_by" varchar(32) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
