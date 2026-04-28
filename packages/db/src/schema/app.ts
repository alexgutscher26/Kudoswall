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
export const videoProcessingStatusEnum = pgEnum("video_processing_status", [
  "pending",
  "processing",
  "done",
  "failed",
]);
export const virusScanStatusEnum = pgEnum("virus_scan_status", [
  "pending",
  "clean",
  "infected",
  "error",
  "skipped", // When no API key is configured
]);

export const organization = pgTable(
  "organization",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    plan: planEnum("plan").default("free").notNull(),
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id"),
    subscriptionStatus: subscriptionStatusEnum("subscription_status"),
    trialEndsAt: timestamp("trial_ends_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [index("organization_owner_id_idx").on(table.ownerId)],
);

export const workspace = pgTable(
  "workspace",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    organizationId: text("organization_id").references(() => organization.id, {
      onDelete: "set null",
    }),
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
    index("workspace_organization_id_idx").on(table.organizationId),
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
    index("workspace_member_workspace_user_role_idx").on(
      table.workspaceId,
      table.userId,
      table.role,
    ),
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
    updatedById: text("updated_by_id").references(() => user.id),
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
    customCss: text("custom_css"),
    emailFromName: text("email_from_name"),
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
    index("project_workspace_active_idx").on(table.workspaceId, table.active),
    index("project_collection_slug_idx").on(table.collectionSlug),
    index("project_custom_domain_idx").on(table.customDomain),
  ],
);

export const testimonial = pgTable(
  "testimonial",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
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
    verifiedVia: text("verified_via"), // "google" | "linkedin"
    verifiedAt: timestamp("verified_at"),
    verifiedId: text("verified_id"), // Provider-specific unique ID
    status: testimonialStatusEnum("status").default("pending").notNull(),
    type: testimonialTypeEnum("type").default("text").notNull(),
    videoUrl: text("video_url"),
    /** JSON: { "360p": "key", "720p": "key", "1080p": "key" } — populated after transcoding */
    videoTranscodesJson: text("video_transcodes_json"),
    videoProcessingStatus: videoProcessingStatusEnum("video_processing_status").default("pending"),
    virusScanStatus: virusScanStatusEnum("virus_scan_status").default("pending"),
    virusScanHash: text("virus_scan_hash"), // SHA-256 of the uploaded file for audit trail
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("testimonial_workspace_id_idx").on(table.workspaceId),
    index("testimonial_project_id_idx").on(table.projectId),
    index("testimonial_status_idx").on(table.status),
    index("testimonial_project_status_createdAt_idx").on(
      table.projectId,
      table.status,
      table.createdAt,
    ),
  ],
);

/**
 * Tracks async video transcoding jobs.
 * One row per video upload; status progresses: pending → processing → done | failed.
 */
export const videoTranscodingJob = pgTable(
  "video_transcoding_job",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    testimonialId: text("testimonial_id")
      .notNull()
      .references(() => testimonial.id, { onDelete: "cascade" }),
    /** R2 key of the original uploaded video */
    sourceKey: text("source_key").notNull(),
    status: videoProcessingStatusEnum("status").default("pending").notNull(),
    /** JSON: { "360p": "key", "720p": "key", "1080p": "key" } */
    outputKeysJson: text("output_keys_json"),
    error: text("error"),
    attempts: integer("attempts").default(0).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
    processedAt: timestamp("processed_at"),
  },
  (table) => [
    index("transcoding_job_workspace_id_idx").on(table.workspaceId),
    index("transcoding_job_testimonial_id_idx").on(table.testimonialId),
    index("transcoding_job_status_idx").on(table.status),
    index("transcoding_job_status_created_at_idx").on(table.status, table.createdAt),
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
    deletedAt: timestamp("deleted_at"),
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
    customCss: text("custom_css"),
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
    index("analytics_event_workspace_type_createdAt_idx").on(
      table.workspaceId,
      table.eventType,
      table.createdAt,
    ),
    index("analytics_event_widget_type_createdAt_idx").on(
      table.widgetId,
      table.eventType,
      table.createdAt,
    ),
  ],
);

export const auditLog = pgTable(
  "audit_log",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id").references(() => workspace.id, {
      onDelete: "cascade",
    }),
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
    index("audit_log_workspace_id_idx").on(table.workspaceId),
    index("audit_log_actor_id_idx").on(table.actorId),
    index("audit_log_entity_idx").on(table.entityType, table.entityId),
  ],
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const organizationRelations = relations(organization, ({ one, many }) => ({
  owner: one(user, {
    fields: [organization.ownerId],
    references: [user.id],
  }),
  workspaces: many(workspace),
}));

export const workspacePermissionSet = pgTable(
  "workspace_permission_set",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    role: workspaceRoleEnum("role").notNull(),
    permissionsJson: text("permissions_json").notNull(), // Array of Permission strings
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => new Date())
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("workspace_permission_set_workspace_role_idx").on(table.workspaceId, table.role),
  ],
);

export const workspaceRelations = relations(workspace, ({ one, many }) => ({
  owner: one(user, {
    fields: [workspace.ownerId],
    references: [user.id],
  }),
  organization: one(organization, {
    fields: [workspace.organizationId],
    references: [organization.id],
  }),
  projects: many(project),
  tags: many(tag),
  widgets: many(widget),
  members: many(workspaceMember),
  invitations: many(workspaceInvitation),
  permissionSets: many(workspacePermissionSet),
}));

export const workspacePermissionSetRelations = relations(workspacePermissionSet, ({ one }) => ({
  workspace: one(workspace, {
    fields: [workspacePermissionSet.workspaceId],
    references: [workspace.id],
  }),
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
  updatedBy: one(user, {
    fields: [workspaceInvitation.updatedById],
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
  workspace: one(workspace, {
    fields: [testimonial.workspaceId],
    references: [workspace.id],
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
  workspace: one(workspace, {
    fields: [auditLog.workspaceId],
    references: [workspace.id],
  }),
}));
