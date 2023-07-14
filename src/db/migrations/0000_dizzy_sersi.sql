CREATE TABLE IF NOT EXISTS "account" (
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
	"refresh_token_expires_in" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_provider_provider_account_id" PRIMARY KEY("provider","provider_account_id");
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coffee_bean" (
	"id" uuid PRIMARY KEY NOT NULL,
	"barista_id" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand" varchar(255),
	"taste_notes" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coffee_bean_tasting_note" (
	"id" uuid PRIMARY KEY NOT NULL,
	"coffee_bean_id" uuid NOT NULL,
	"tasting_note_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "session" (
	"session_token" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasting_note" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"barista_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "verification_token" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "verification_token" ADD CONSTRAINT "verification_token_identifier_token" PRIMARY KEY("identifier","token");
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "barista_idx" ON "coffee_bean" ("barista_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "coffee_bean_idx" ON "coffee_bean_tasting_note" ("coffee_bean_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tasting_note_idx" ON "coffee_bean_tasting_note" ("tasting_note_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_idx" ON "session" ("user_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coffee_bean" ADD CONSTRAINT "coffee_bean_barista_id_user_id_fk" FOREIGN KEY ("barista_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coffee_bean_tasting_note" ADD CONSTRAINT "coffee_bean_tasting_note_coffee_bean_id_coffee_bean_id_fk" FOREIGN KEY ("coffee_bean_id") REFERENCES "coffee_bean"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coffee_bean_tasting_note" ADD CONSTRAINT "coffee_bean_tasting_note_tasting_note_id_tasting_note_id_fk" FOREIGN KEY ("tasting_note_id") REFERENCES "tasting_note"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tasting_note" ADD CONSTRAINT "tasting_note_barista_id_user_id_fk" FOREIGN KEY ("barista_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
