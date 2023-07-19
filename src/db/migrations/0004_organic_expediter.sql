ALTER TABLE "coffee_beans" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "coffee_beans_tasting_notes" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "tasting_notes" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();