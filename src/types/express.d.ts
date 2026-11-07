// types/express.d.ts
import type { PermissionCode } from '../constants/permissions.const.js';

export interface ControllerResponseData {
  statusCode?: number;
  payload: any;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        sessionId: string;
        accessTokenExpireAt: number;
        accessTokenId: string;
        roleId?: string;
        permissions: PermissionCode[];
      };

      userPermissions?: PermissionCode[];

      cloudinaryData?:
        | {
            url: string;
            publicId: string;
          }
        | undefined;
    }

    interface Locals {
      response?: ControllerResponseData;
    }
  }
}

export {};
