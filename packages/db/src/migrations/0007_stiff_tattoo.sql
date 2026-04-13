ALTER TABLE "analytics_event" ADD COLUMN "visitor_id" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "custom_domain" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "custom_domain_verified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "custom_domain_verification_token" text;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "custom_domain_verification_error" text;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "dpa_accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "dpa_accepted_by_id" text;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "retention_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "workspace" ADD COLUMN "retention_days" integer DEFAULT 365;--> statement-breakpoint
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_dpa_accepted_by_id_user_id_fk" FOREIGN KEY ("dpa_accepted_by_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_event_visitor_id_idx" ON "analytics_event" USING btree ("visitor_id");--> statement-breakpoint
CREATE INDEX "project_custom_domain_idx" ON "project" USING btree ("custom_domain");--> statement-breakpoint
CREATE INDEX "workspace_dpa_accepted_idx" ON "workspace" USING btree ("dpa_accepted_at");--> statement-breakpoint
ALTER TABLE "project" ADD CONSTRAINT "project_custom_domain_unique" UNIQUE("custom_domain");