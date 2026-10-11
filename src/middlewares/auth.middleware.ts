import type { NextFunction, Request, Response } from 'express';
import type { ApiResponse } from '../types/api-response.types.js';
import { verifyAccessToken } from '../utils/token.utils.js';
import { logError } from '../utils/logs.util.js';
import { fetchUserById } from '../services/user/fetchUserById.js';
import { removeSession } from '../services/sessions/removeSession.js';
import { redisClient } from '../config/redis.js';
import { REDIS_BLACKLIST_TOKEN_KEY } from '../constants/redis.const.js';

export async function authMiddleware(
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
) {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader?.startsWith('Bearer ')
    ? authHeader.split(' ')[1]
    : undefined;

  if (!accessToken) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized access',
    });
  }

  try {
    const decoded = verifyAccessToken(accessToken);
    console.log(decoded)
    if (!decoded || !decoded.iat || !decoded.exp || !decoded.jti) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    //check token is balcklisted or not
    const isBlackListed = await redisClient.exists(`${REDIS_BLACKLIST_TOKEN_KEY}:${decoded.jti}`)

    if(isBlackListed)
    {
      return res.status(403).json({
        success : false,
        message : "Unauthorized token is blacklisted",
        data : null
      })
    }

    const user = await fetchUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists',
      });
    }

    // Check if password was changed after this token was created
    if (user.passwordChangedAt) {
      const passwordChangedAtSeconds = Math.floor(
        new Date(user.passwordChangedAt).getTime() / 1000
      );

      // Compare both values in seconds (decoded.iat is already in seconds)
      if (passwordChangedAtSeconds > decoded.iat) {
        // Delete the invalidated session from the database
        if (decoded.sessionId) {
          await removeSession(decoded.sessionId)
        }

        return res.status(401).json({
          success: false,
          message: 'Password was changed recently. Please log in again.',
        });
      }
    }

    req.user = {
      id: decoded.userId,
      sessionId: decoded.sessionId,
      accessTokenExpireAt : decoded.exp,
      accessTokenId : decoded.jti
    };

    next();
  } catch (error) {
    logError('auth middleware', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
}