import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response.types.js';
import { logError } from '../../utils/logs.util.js';
import { DB } from '../../config/dbConnect.js';
import { userTable } from '../../db/schemas/user.schema.js';
import { generateHash, verifyHash } from '../../utils/bcrypt.utils.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.utils.js';
import { eq } from 'drizzle-orm';
import { sessionTable } from '../../db/schemas/session.schema.js';
import { sendValidatedResponse } from '../../utils/response.util.js';
import { loginResponseSchema } from '../../api-schemas/auth.schemas.js';

interface LoginUserBody {
  email: string;
  password: string;
}

export async function login(
  req: Request<any, any, LoginUserBody>,
  res: Response<ApiResponse>,
) {
  try {
    const { email, password } = req.body;

    const user = (
      await DB.getInstance().select().from(userTable).where(eq(userTable.email, email))
    )[0];

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User does not exist',
      });
    }

    const isPasswordMatch = user.passwordHash && verifyHash(user.passwordHash, password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Handle access and refresh token
    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

    // Create session
    const session = (
      await DB.getInstance()
        .insert(sessionTable)
        .values({
          userId: user.id,
          refreshTokenHash: await generateHash(refreshToken),
        })
        .returning({
          id: sessionTable.id,
        })
    )[0];

    if (!session) {
      throw new Error('Failed to create a session');
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    // Validate response schema before sending
    return sendValidatedResponse(res, 200, loginResponseSchema, {
      success: true,
      message: 'User Loggedin',
      data: {
        fullName: user.fullName,
        email: user.email,
        avatarURL: user.avatarURL,
        createdAt: user.createdAt,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    logError('login controller', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
