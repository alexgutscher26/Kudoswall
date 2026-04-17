import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
  integer,
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
export const analyticsEventTypeEnum = pgEnum("analytics_event_type", [
  "view",
  "click",
  "video_play",
  "video_progress",
]);
export const auditActionEnum = pgEnum("audit_action", ["create", "update", "delete"]);
export const workspaceRoleEnum = pgEnum("workspace_role", ["owner", "admin", "member"]);
export const planEnum = pgEnum("plan", ["free", "plan_1", "plan_2", "ltd"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "incomplete",
  "incomplete_expired",
  "paused",
  "unpaid",
]);

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
    plan: planEnum("plan").default("free").notNull(),
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id"),
    subscriptionStatus: subscriptionStatusEnum("subscription_status"),
    brandingJson: text("branding_json"),
    notificationSettingsJson: text("notification_settings_json"),
    onboardingStatus: text("onboarding_status"),
    dpaAcceptedAt: timestamp("dpa_accepted_at"),
    dpaAcceptedById: text("dpa_accepted_by_id").references(() => user.id),
    retentionEnabled: boolean("retention_enabled").default(false).notNull(),
    retentionDays: integer("retention_days").default(365), // Default to 1 year if enabled
    trialEndsAt: timestamp("trial_ends_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("workspace_slug_idx").on(table.slug),
    index("workspace_owner_id_idx").on(table.ownerId),
    index("workspace_dpa_accepted_idx").on(table.dpaAcceptedAt),
  ],
);

export const workspaceMember = pgTable(
  "workspace_member",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").default("member").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("workspace_member_workspace_id_idx").on(table.workspaceId),
    index("workspace_member_user_id_idx").on(table.userId),
    index("workspace_member_role_idx").on(table.role),
  ],
);

export const workspaceInvitation = pgTable(
  "workspace_invitation",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    email: text("email").notNull(),
    role: workspaceRoleEnum("role").default("member").notNull(),
    token: text("token").notNull().unique(),
    invitedById: text("invited_by_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("workspace_invitation_workspace_id_idx").on(table.workspaceId),
    index("workspace_invitation_email_idx").on(table.email),
    index("workspace_invitation_token_idx").on(table.token),
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
    customDomain: text("custom_domain").unique(),
    customDomainVerified: boolean("custom_domain_verified").default(false).notNull(),
    customDomainVerificationToken: text("custom_domain_verification_token"),
    customDomainVerificationError: text("custom_domain_verification_error"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("project_workspace_id_idx").on(table.workspaceId),
    index("project_workspace_slug_idx").on(table.workspaceId, table.slug),
    index("project_collection_slug_idx").on(table.collectionSlug),
    index("project_custom_domain_idx").on(table.customDomain),
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
    deletedAt: timestamp("deleted_at"),
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
    createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { mode: "string" }),
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
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [index("widget_workspace_id_idx").on(table.workspaceId)],
);

export const analyticsEvent = pgTable(
  "analytics_event",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => project.id, { onDelete: "set null" }),
    widgetId: text("widget_id").references(() => widget.id, { onDelete: "set null" }),
    visitorId: text("visitor_id"), // Hash of IP + User-Agent for cookie-less unique tracking
    eventType: analyticsEventTypeEnum("event_type").notNull(),
    metadataJson: text("metadata_json"), // Store additional event data
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("analytics_event_workspace_id_idx").on(table.workspaceId),
    index("analytics_event_project_id_idx").on(table.projectId),
    index("analytics_event_widget_id_idx").on(table.widgetId),
    index("analytics_event_type_idx").on(table.eventType),
    index("analytics_event_visitor_id_idx").on(table.visitorId),
  ],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    actorId: text("actor_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id").notNull(),
    action: auditActionEnum("action").notNull(),
    diff: text("diff"), // Stored as JSON string
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("audit_log_actor_id_idx").on(table.actorId),
    index("audit_log_entity_idx").on(table.entityType, table.entityId),
  ],
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
  members: many(workspaceMember),
  invitations: many(workspaceInvitation),
}));

export const workspaceMemberRelations = relations(workspaceMember, ({ one }) => ({
  workspace: one(workspace, {
    fields: [workspaceMember.workspaceId],
    references: [workspace.id],
  }),
  user: one(user, {
    fields: [workspaceMember.userId],
    references: [user.id],
  }),
}));

export const workspaceInvitationRelations = relations(workspaceInvitation, ({ one }) => ({
  workspace: one(workspace, {
    fields: [workspaceInvitation.workspaceId],
    references: [workspace.id],
  }),
  invitedBy: one(user, {
    fields: [workspaceInvitation.invitedById],
    references: [user.id],
  }),
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

export const widgetRelations = relations(widget, ({ one, many }) => ({
  workspace: one(workspace, {
    fields: [widget.workspaceId],
    references: [workspace.id],
  }),
  analyticsEvents: many(analyticsEvent),
}));

export const analyticsEventRelations = relations(analyticsEvent, ({ one }) => ({
  workspace: one(workspace, {
    fields: [analyticsEvent.workspaceId],
    references: [workspace.id],
  }),
  project: one(project, {
    fields: [analyticsEvent.projectId],
    references: [project.id],
  }),
  widget: one(widget, {
    fields: [analyticsEvent.widgetId],
    references: [widget.id],
  }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  actor: one(user, {
    fields: [auditLog.actorId],
    references: [user.id],
  }),
}));
