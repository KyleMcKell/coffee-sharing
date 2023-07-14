CREATE TABLE IF NOT EXISTS "accounts" (
	"user_id" varchar(255) NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" varchar(255),
	"access_token" varchar(255),
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" varchar(255),
	"session_state" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_provider_provider_account_id" PRIMARY KEY("provider","provider_account_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coffee_beans" (
	"id" uuid PRIMARY KEY NOT NULL,
	"barista_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand" varchar(255),
	"taste_notes" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coffee_beans_tasting_notes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"coffee_bean_id" uuid NOT NULL,
	"tasting_note_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "sessions" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasting_notes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"barista_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_identifier_token" PRIMARY KEY("identifier","token");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "accounts" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "barista_idx" ON "coffee_beans" ("barista_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "coffee_bean_idx" ON "coffee_beans_tasting_notes" ("coffee_bean_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasting_note_idx" ON "coffee_beans_tasting_notes" ("tasting_note_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "sessions" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coffee_beans" ADD CONSTRAINT "coffee_beans_barista_id_users_id_fk" FOREIGN KEY ("barista_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coffee_beans_tasting_notes" ADD CONSTRAINT "coffee_beans_tasting_notes_coffee_bean_id_coffee_beans_id_fk" FOREIGN KEY ("coffee_bean_id") REFERENCES "coffee_beans"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coffee_beans_tasting_notes" ADD CONSTRAINT "coffee_beans_tasting_notes_tasting_note_id_tasting_notes_id_fk" FOREIGN KEY ("tasting_note_id") REFERENCES "tasting_notes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasting_notes" ADD CONSTRAINT "tasting_notes_barista_id_users_id_fk" FOREIGN KEY ("barista_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
