ALTER TABLE "accounts" DROP CONSTRAINT "accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_userId_users_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "unique_email_idx";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "type" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "provider" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "providerAccountId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "refresh_token" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "access_token" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "token_type" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "scope" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "id_token" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "session_state" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "sessionToken" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "userId" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "verificationToken" ALTER COLUMN "identifier" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "verificationToken" ALTER COLUMN "token" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "image" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refresh_token_expires_in" integer;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "sessions" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "verificationToken" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "updated_at";