ALTER TYPE "public"."analytics_event_type" ADD VALUE 'video_progress';--> statement-breakpoint
ALTER TABLE "analytics_event" ADD COLUMN "metadata_json" text;