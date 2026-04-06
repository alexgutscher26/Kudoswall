-- BASELINE: Schema already exists in DB
-- 0001_neat_bloodscream
--> statement-breakpoint
CREATE TABLE "analytics_event" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"project_id" text,
	"widget_id" text,
	"event_type" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tag" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#e8527a' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonial_to_tag" (
	"testimonial_id" text NOT NULL,
	"tag_id" text NOT NULL,
	CONSTRAINT "testimonial_to_tag_testimonial_id_tag_id_pk" PRIMARY KEY("testimonial_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "widget" (
	"id" text PRIMARY KEY NOT NULL,
	"workspace_id" text NOT NULL,
	"name" text NOT NULL,
	"settings_json" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "testimonial" ALTER COLUMN "rating" SET DATA TYPE double precision;--> statement-breakpoint
ALTER TABLE "testimonial" ALTER COLUMN "rating" SET DEFAULT 5;--> statement-breakpoint
ALTER TABLE "project" ADD COLUMN "collection_settings_json" text;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_project_id_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "analytics_event" ADD CONSTRAINT "analytics_event_widget_id_widget_id_fk" FOREIGN KEY ("widget_id") REFERENCES "public"."widget"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tag" ADD CONSTRAINT "tag_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonial_to_tag" ADD CONSTRAINT "testimonial_to_tag_testimonial_id_testimonial_id_fk" FOREIGN KEY ("testimonial_id") REFERENCES "public"."testimonial"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "testimonial_to_tag" ADD CONSTRAINT "testimonial_to_tag_tag_id_tag_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "widget" ADD CONSTRAINT "widget_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "analytics_event_workspace_id_idx" ON "analytics_event" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "analytics_event_project_id_idx" ON "analytics_event" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "analytics_event_widget_id_idx" ON "analytics_event" USING btree ("widget_id");--> statement-breakpoint
CREATE INDEX "analytics_event_type_idx" ON "analytics_event" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "tag_workspace_id_idx" ON "tag" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "testimonial_to_tag_testimonial_id_idx" ON "testimonial_to_tag" USING btree ("testimonial_id");--> statement-breakpoint
CREATE INDEX "testimonial_to_tag_tag_id_idx" ON "testimonial_to_tag" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "widget_workspace_id_idx" ON "widget" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "project_workspace_id_idx" ON "project" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "testimonial_status_idx" ON "testimonial" USING btree ("status");--> statement-breakpoint
CREATE INDEX "workspace_owner_id_idx" ON "workspace" USING btree ("owner_id");