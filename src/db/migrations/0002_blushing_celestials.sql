CREATE TABLE IF NOT EXISTS "coffee_bean" (
	"id" uuid PRIMARY KEY NOT NULL,
	"baristaId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand" varchar(255),
	"tasteNotes" json,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "coffee_bean_tasting_note" (
	"id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tasting_note" (
	"id" uuid PRIMARY KEY NOT NULL,
	"baristaId" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"brand" varchar(255),
	"tasteNotes" jsonb,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" RENAME TO "account";--> statement-breakpoint
ALTER TABLE "sessions" RENAME TO "session";--> statement-breakpoint
ALTER TABLE "users" RENAME TO "user";--> statement-breakpoint
ALTER TABLE "verificationToken" RENAME TO "verification_token";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coffee_bean_tasting_note" ADD CONSTRAINT "coffee_bean_tasting_note_id_coffee_bean_id_fk" FOREIGN KEY ("id") REFERENCES "coffee_bean"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "coffee_bean_tasting_note" ADD CONSTRAINT "coffee_bean_tasting_note_id_tasting_note_id_fk" FOREIGN KEY ("id") REFERENCES "tasting_note"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
