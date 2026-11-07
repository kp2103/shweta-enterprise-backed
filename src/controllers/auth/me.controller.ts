import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response.types.js';
import { logError } from '../../utils/logs.util.js';
import { DB } from '../../config/dbConnect.js';
import { userTable } from '../../db/schemas/user.schema.js';
import { eq } from 'drizzle-orm';
import { sendValidatedResponse } from '../../utils/response.util.js';
import { meResponseSchema } from '../../api-schemas/auth.schemas.js';

export async function me(
  req: Request,
  res: Response<ApiResponse>,
) {
  try {
    const userInfo = req.user;

    if (!userInfo) {
      return res.status(403).json({
        success: false,
        message: 'Invalid user Data',
      });
    }

    const userId = userInfo.id;
    const user = (
      await DB.getInstance().select().from(userTable).where(eq(userTable.id, userId))
    )[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      });
    }

    console.log("Check : ", userInfo.permissions)
    // Validate response schema before sending
    return sendValidatedResponse(res, 200, meResponseSchema, {
      success: true,
      message: 'User exist',
      data: {
        fullName: user.fullName,
        email: user.email,
        avatarURL: user.avatarURL,
        createdAt: user.createdAt,
        permissions: userInfo.permissions
      },
    });
  } catch (error) {
    logError('me controller', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
