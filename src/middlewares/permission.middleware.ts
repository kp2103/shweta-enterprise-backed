import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../types/api-response.types.js';
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from '../services/permissions/getUserPermissions.service.js';
import type { PermissionCode } from '../constants/permissions.const.js';
import { logError } from '../utils/logs.util.js';

export type PermissionMode = 'any' | 'all';

/**
 * Middleware factory that returns an Express middleware to enforce permissions.
 *
 * @param permissions - Array of PermissionCode required for the route.
 * @param mode - Mode of evaluation: 'any' (user needs at least one) or 'all' (user needs all). Defaults to 'any'.
 *
 * Uses `hasPermission`, `hasAllPermissions`, and `hasAnyPermission` from the permission service.
 */
export function checkPermission(
  requiredPermissions: PermissionCode[],
  mode: PermissionMode = 'any'
) {
  return async (req: Request, res: Response<ApiResponse>, next: NextFunction) => {
    try {
      if (!req.user?.id || !req.user.permissions || req.user.permissions.length <= 0) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Authentication required',
        });
      }

      // Use hasPermission for single, hasAllPermissions for 'all', hasAnyPermission for 'any'
      const hasAccess =
        (requiredPermissions.length === 1 && requiredPermissions[0])
          ? await hasPermission(req.user.id, requiredPermissions[0], req.user.permissions)
          : mode === 'all'
            ? await hasAllPermissions(req.user.id, requiredPermissions, req.user.permissions)
            : await hasAnyPermission(req.user.id, requiredPermissions, req.user.permissions);

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: `Forbidden: Missing required permission(s) [${requiredPermissions.join(', ')}]`,
        });
      }

      next();
    } catch (error) {
      logError('permission middleware', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during authorization check',
      });
    }
  };
}

/**
 * Convenience alias for `checkPermission`.
 */
export const permissionMiddleware = checkPermission;

/**
 * Require user to have AT LEAST ONE of the specified permissions.
 */
export function requirePermission(...requiredPermissions: PermissionCode[]) {
  return checkPermission(requiredPermissions, 'any');
}

/**
 * Require user to have ALL of the specified permissions.
 */
export function requireAllPermissions(...requiredPermissions: PermissionCode[]) {
  return checkPermission(requiredPermissions, 'all');
}

// export async function verifyOwnershipOrPermission({
//   userId,
//   resourceOwnerUserId,
//   bypassPermission,
// }: {
//   userId: string;
//   resourceOwnerUserId: string;
//   bypassPermission: PermissionCode;
// }): Promise<boolean> {
//   const hasBypass = await hasPermission(userId, bypassPermission,);

//   if (hasBypass) {
//     return true; // Admin with global view permission
//   }

//   // User owns the record directly
//   return userId === resourceOwnerUserId;
// }
