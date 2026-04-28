import { and, eq, isNull } from "drizzle-orm";
import { workspaceMember, workspacePermissionSet } from "@my-better-t-app/db/schema";
import { DEFAULT_ROLE_PERMISSIONS, type Permission } from "../logic/permissions";

export async function getPermissions(
  db: any,
  workspaceId: string,
  userId: string
): Promise<Permission[]> {
  const membership = await db.query.workspaceMember.findFirst({
    where: and(
      eq(workspaceMember.workspaceId, workspaceId),
      eq(workspaceMember.userId, userId),
      isNull(workspaceMember.deletedAt)
    ),
  });

  if (!membership) return [];
  if (membership.role === "owner") return [...DEFAULT_ROLE_PERMISSIONS.owner];

  const permissionSet = await db.query.workspacePermissionSet.findFirst({
    where: and(
      eq(workspacePermissionSet.workspaceId, workspaceId),
      eq(workspacePermissionSet.role, membership.role)
    ),
  });

  if (!permissionSet) {
    return DEFAULT_ROLE_PERMISSIONS[membership.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || [];
  }

  try {
    return JSON.parse(permissionSet.permissionsJson) as Permission[];
  } catch (e) {
    console.error("Failed to parse permissionsJson", e);
    return DEFAULT_ROLE_PERMISSIONS[membership.role as keyof typeof DEFAULT_ROLE_PERMISSIONS] || [];
  }
}

export async function hasPermission(
  db: any,
  workspaceId: string,
  userId: string,
  permission: Permission
): Promise<boolean> {
  const permissions = await getPermissions(db, workspaceId, userId);
  return permissions.includes(permission);
}
