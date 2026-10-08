ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_key";--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "expires_at" SET DEFAULT '2026-10-14 18:36:23.876';--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_refresh_token_hash_key" UNIQUE("refresh_token_hash");