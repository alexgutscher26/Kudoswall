export const ALL_PERMISSIONS = [
  "project:create",
  "project:update",
  "project:delete",
  "testimonial:approve",
  "testimonial:archive",
  "testimonial:delete",
  "tag:manage",
  "widget:manage",
  "team:invite",
  "team:manage_roles",
  "team:remove_member",
  "billing:manage",
  "settings:manage",
] as const;

export type Permission = (typeof ALL_PERMISSIONS)[number];

export const DEFAULT_ROLE_PERMISSIONS: Record<"owner" | "admin" | "member", Permission[]> = {
  owner: [...ALL_PERMISSIONS],
  admin: [
    "project:create",
    "project:update",
    "project:delete",
    "testimonial:approve",
    "testimonial:archive",
    "testimonial:delete",
    "tag:manage",
    "widget:manage",
    "team:invite",
    "settings:manage",
  ],
  member: [
    "testimonial:approve",
    "testimonial:archive",
    "tag:manage",
  ],
};
