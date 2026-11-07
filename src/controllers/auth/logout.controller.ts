import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response.types.js';
import { logError } from '../../utils/logs.util.js';
import { removeSession } from '../../services/sessions/removeSession.js';
import { getTokenRemainingLife } from '../../utils/token.utils.js';
import { redisClient } from '../../config/redis.js';
import { REDIS_BLACKLIST_TOKEN_KEY } from '../../constants/redis.const.js';
import { sendValidatedResponse } from '../../utils/response.util.js';
import { logoutResponseSchema } from '../../api-schemas/auth.schemas.js';

interface LogoutRequestBody {
  refreshToken?: string;
}

export async function logout(
  req: Request<any, any, LogoutRequestBody>,
  res: Response<ApiResponse>,
) {
  try {
    const userInfo = req.user;

    if (!userInfo) {
      return res.status(403).json({
        success: false,
        message: 'User object is invalid',
      });
    }

    // 1. Remove the refresh token/session from database
    const isRemoved = await removeSession(userInfo.sessionId);

    if (!isRemoved) {
      throw new Error('Failed to remove the session from database');
    }

    // 2. Calculate remaining life of the Access Token
    const tokenLife = getTokenRemainingLife(userInfo.accessTokenExpireAt);

    // 3. Blacklist the Access Token in Redis
    if (tokenLife.remainingSeconds > 0) {
      const blacklisted = await redisClient.set(
        `${REDIS_BLACKLIST_TOKEN_KEY}:${userInfo.accessTokenId}`,
        'REVOKED',
        'EX',
        tokenLife.remainingSeconds,
      );

      if (!blacklisted) {
        throw new Error('Failed to blacklist token in Redis');
      }
    }

    // Validate response schema before sending
    return sendValidatedResponse(res, 200, logoutResponseSchema, {
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error) {
    logError('logout controller', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
