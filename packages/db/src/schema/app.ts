import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
  doublePrecision,
  primaryKey,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const testimonialStatusEnum = pgEnum("testimonial_status", [
  "pending",
  "approved",
  "archived",
]);
export const testimonialTypeEnum = pgEnum("testimonial_type", ["text", "video"]);

export const workspace = pgTable(
  "workspace",
  {
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
  },
  (table) => [
    index("workspace_slug_idx").on(table.slug),
    index("workspace_owner_id_idx").on(table.ownerId),
  ],
);

export const project = pgTable(
  "project",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    collectionSlug: text("collection_slug").unique(),
    description: text("description"),
    thankYouMessage: text("thank_you_message"),
    collectionSettingsJson: text("collection_settings_json"),
    active: boolean("active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("project_workspace_id_idx").on(table.workspaceId),
    index("project_workspace_slug_idx").on(table.workspaceId, table.slug),
    index("project_collection_slug_idx").on(table.collectionSlug),
  ],
);

export const testimonial = pgTable(
  "testimonial",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => project.id, { onDelete: "cascade" }),
    content: text("content"),
    rating: doublePrecision("rating").default(5.0),
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
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("testimonial_project_id_idx").on(table.projectId),
    index("testimonial_status_idx").on(table.status),
  ],
);

export const tag = pgTable(
  "tag",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    color: text("color").default("#e8527a").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("tag_workspace_id_idx").on(table.workspaceId)],
);

export const testimonialToTag = pgTable(
  "testimonial_to_tag",
  {
    testimonialId: text("testimonial_id")
      .notNull()
      .references(() => testimonial.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tag.id, { onDelete: "cascade" }),
  },
  (table) => [
    primaryKey({ columns: [table.testimonialId, table.tagId] }),
    index("testimonial_to_tag_testimonial_id_idx").on(table.testimonialId),
    index("testimonial_to_tag_tag_id_idx").on(table.tagId),
  ],
);

export const widget = pgTable(
  "widget",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    settingsJson: text("settings_json").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
  },
  (table) => [index("widget_workspace_id_idx").on(table.workspaceId)],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const workspaceRelations = relations(workspace, ({ one, many }) => ({
  owner: one(user, {
    fields: [workspace.ownerId],
    references: [user.id],
  }),
  projects: many(project),
  tags: many(tag),
  widgets: many(widget),
}));

export const projectRelations = relations(project, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [project.workspaceId],
    references: [workspace.id],
  }),
  testimonials: many(testimonial),
}));

export const testimonialRelations = relations(testimonial, ({ one, many }) => ({
  project: one(project, {
    fields: [testimonial.projectId],
    references: [project.id],
  }),
  testimonialToTags: many(testimonialToTag),
}));

export const tagRelations = relations(tag, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [tag.workspaceId],
    references: [workspace.id],
  }),
  testimonialToTags: many(testimonialToTag),
}));

export const testimonialToTagRelations = relations(testimonialToTag, ({ one }) => ({
  testimonial: one(testimonial, {
    fields: [testimonialToTag.testimonialId],
    references: [testimonial.id],
  }),
  tag: one(tag, {
    fields: [testimonialToTag.tagId],
    references: [tag.id],
  }),
}));

export const widgetRelations = relations(widget, ({ one }) => ({
  workspace: one(workspace, {
    fields: [widget.workspaceId],
    references: [workspace.id],
  }),
}));
