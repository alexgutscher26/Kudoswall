CREATE TYPE "public"."audit_action" AS ENUM('create', 'update', 'delete');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"action" "audit_action" NOT NULL,
	"diff" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "analytics_event" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "tag" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "testimonial" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "widget" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_user_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_actor_id_idx" ON "audit_log" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity_type","entity_id");