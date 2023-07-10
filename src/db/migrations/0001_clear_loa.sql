CREATE INDEX IF NOT EXISTS "user_idx" ON "account" ("user_id");--> statement-breakpoint
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
 ALTER TABLE "tasting_note" ADD CONSTRAINT "tasting_note_barista_id_user_id_fk" FOREIGN KEY ("barista_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
