import { eq } from 'drizzle-orm';
import { DB } from '../../config/dbConnect.js';
import { userTable } from '../../db/schemas/user.schema.js';
import { rolesTable } from '../../db/schemas/roles.schema.js';
import { permissionsTable } from '../../db/schemas/permissions.schema.js';
import { rolePermissionsTable } from '../../db/schemas/rolePermissions.schema.js';
import { logError } from '../../utils/logs.util.js';
import type { PermissionCode } from '../../constants/permissions.const.js';

export interface UserPermissionDetails {
  userId: string;
  roleId: string;
  role: string;
  permissions: PermissionCode[];
}

/**
 * Common helper: Fetch user with their assigned role name and roleId.
 */
export async function getUserByUserId(userId: string) {
  if (!userId) return null;

  try {
    const [user] = await DB.getInstance()
      .select({
        userId: userTable.id,
        roleId: userTable.roleId,
        role: rolesTable.role,
      })
      .from(userTable)
      .innerJoin(rolesTable, eq(rolesTable.roleId, userTable.roleId))
      .where(eq(userTable.id, userId))
      .limit(1);

    return user ?? null;
  } catch (error) {
    logError('getUserByUserId service', error);
    return null;
  }
}

/**
 * Common core function: Fetch all permission codes assigned to a specific role ID.
 * This is the single source of truth for role-to-permission resolution.
 */
export async function getPermissionsByRoleId(
  roleId: string
): Promise<PermissionCode[]> {
  try {
    const permissions = await DB.getInstance()
      .select({
        code: permissionsTable.code,
      })
      .from(rolePermissionsTable)
      .innerJoin(
        permissionsTable,
        eq(rolePermissionsTable.permissionId, permissionsTable.id)
      )
      .where(eq(rolePermissionsTable.roleId, roleId));

    return permissions.map((p) => p.code as PermissionCode);
  } catch (error) {
    logError('get permissions by roleId service', error);
    return [];
  }
}

/**
 * Fetch permission codes for a user by resolving their roleId and reusing `getPermissionsByRoleId`.
 */
export async function getUserPermissions(userId: string): Promise<PermissionCode[]> {
  try {
    const user = await getUserByUserId(userId);

    if (!user) {
      return [];
    }

    return getPermissionsByRoleId(user.roleId);
  } catch (error) {
    logError('get user permissions service', error);
    return [];
  }
}

/**
 * Fetch complete role information and assigned permission codes for a user.
 */
export async function getUserRoleAndPermissions(
  userId: string
): Promise<UserPermissionDetails | null> {
  try {
    const user = await getUserByUserId(userId);
    if (!user) {
      return null;
    }

    const permissions = await getPermissionsByRoleId(user.roleId);

    return {
      userId: user.userId,
      roleId: user.roleId,
      role: user.role,
      permissions,
    };
  } catch (error) {
    logError('get user role and permissions service', error);
    return null;
  }
}

/**
 * Check if a user has a specific permission
 */
export async function hasPermission(
  userId: string,
  requiredPermission: PermissionCode | string,
  permissions: PermissionCode[]
): Promise<boolean> {
  return permissions.includes(requiredPermission as PermissionCode);
}

/**
 * Check if a user has any of the requested permissions
 */
export async function hasAnyPermission(
  userId: string,
  requiredPermissions: (PermissionCode | string)[],
  permissions: PermissionCode[]
): Promise<boolean> {
  return requiredPermissions.some((perm) =>
    permissions.includes(perm as PermissionCode)
  );
}

/**
 * Check if a user has all of the requested permissions
 */
export async function hasAllPermissions(
  userId: string,
  requiredPermissions: (PermissionCode | string)[],
  permissions: PermissionCode[]
): Promise<boolean> {
  return requiredPermissions.every((perm) =>
    permissions.includes(perm as PermissionCode)
  );
}
