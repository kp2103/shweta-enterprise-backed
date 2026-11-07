import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response.types.js';
import { logError } from '../../utils/logs.util.js';
import { DB } from '../../config/dbConnect.js';
import { sessionTable } from '../../db/schemas/session.schema.js';
import { and, eq } from 'drizzle-orm';
import { generateHash } from '../../utils/bcrypt.utils.js';
import { generateAccessToken } from '../../utils/token.utils.js';
import { sendValidatedResponse } from '../../utils/response.util.js';
import { refreshTokensResponseSchema } from '../../api-schemas/auth.schemas.js';

interface RefreshTokensBody {
  refreshToken: string;
}

export async function refreshTokens(
  req: Request<any, any, RefreshTokensBody>,
  res: Response<ApiResponse>,
) {
  try {
    const { refreshToken } = req.body;

    const hashedRefreshToken = await generateHash(refreshToken);

    // Check if session is active for this token
    const session = (
      await DB.getInstance()
        .select()
        .from(sessionTable)
        .where(
          and(
            eq(sessionTable.refreshTokenHash, hashedRefreshToken),
            eq(sessionTable.isRevoked, false),
          ),
        )
    )[0];

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired refresh token',
      });
    }

    // Create a new accessToken based on that session
    const accessToken = generateAccessToken({
      sessionId: session.id,
      userId: session.userId,
    });

    // Validate response schema before sending
    return sendValidatedResponse(res, 201, refreshTokensResponseSchema, {
      success: true,
      message: 'New Access token is created',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    logError('refresh token controller', error);

    return res.status(500).json({
      success: false,
      message: 'Internal Server error',
    });
  }
}
