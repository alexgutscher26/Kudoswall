import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer, boolean, pgEnum, index } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const testimonialStatusEnum = pgEnum("testimonial_status", ["pending", "approved", "archived"]);
export const testimonialTypeEnum = pgEnum("testimonial_type", ["text", "video"]);

export const workspace = pgTable("workspace", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  logoUrl: text("logo_url"),
  isPro: boolean("is_pro").default(false).notNull(),
  brandingJson: text("branding_json"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("workspace_slug_idx").on(table.slug),
]);

export const project = pgTable("project", {
  id: text("id").primaryKey(),
  workspaceId: text("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  collectionSlug: text("collection_slug").unique(),
  description: text("description"),
  thankYouMessage: text("thank_you_message"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("project_workspace_slug_idx").on(table.workspaceId, table.slug),
  index("project_collection_slug_idx").on(table.collectionSlug),
]);

export const testimonial = pgTable("testimonial", {
  id: text("id").primaryKey(),
  projectId: text("project_id")
    .notNull()
    .references(() => project.id, { onDelete: "cascade" }),
  content: text("content"),
  rating: integer("rating").default(5),
  authorName: text("author_name"),
  authorEmail: text("author_email"),
  authorImage: text("author_image"),
  authorCompany: text("author_company"),
  authorLinkedin: text("author_linkedin"),
  authorTagline: text("author_tagline"),
  status: testimonialStatusEnum("status").default("pending").notNull(),
  type: testimonialTypeEnum("type").default("text").notNull(),
  videoUrl: text("video_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  index("testimonial_project_id_idx").on(table.projectId),
]);

// ─── Relations ────────────────────────────────────────────────────────────────

export const workspaceRelations = relations(workspace, ({ one, many }) => ({
  owner: one(user, {
    fields: [workspace.ownerId],
    references: [user.id],
  }),
  projects: many(project),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [project.workspaceId],
    references: [workspace.id],
  }),
  testimonials: many(testimonial),
}));

export const testimonialRelations = relations(testimonial, ({ one }) => ({
  project: one(project, {
    fields: [testimonial.projectId],
    references: [project.id],
  }),
}));
