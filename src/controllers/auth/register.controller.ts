import type { Request, Response } from 'express';
import type { ApiResponse, PgError } from '../../types/api-response.types.js';
import { DB } from '../../config/dbConnect.js';
import { userTable } from '../../db/schemas/user.schema.js';
import { generateHash } from '../../utils/bcrypt.utils.js';
import { logError } from '../../utils/logs.util.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.utils.js';
import { sessionTable } from '../../db/schemas/session.schema.js';
import type { USER_ROLES } from '../../db/schemas/roles.schema.js';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../constants/regex.const.js';

interface RegisterUserBody {
  fullName: string;
  email: string;
  password: string;
  avatarURL: string | undefined;
  roleId: (typeof USER_ROLES)[number];
}

export async function register(
  req: Request<null, null, RegisterUserBody>,
  res: Response<ApiResponse>,
) {
  try {
    const { avatarURL, email, fullName, password, roleId } = req.body;

    if (!fullName || !email || !password || !roleId) {
      return res.status(400).json({
        success: false,
        message: 'Required fields are missing',
      });
    }

    // handle the validation error
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Validation Failed',
        error: [
          'password must be atleast 8 character and that must incldue the one uppercase, lowercase and special character',
        ],
      });
    }
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: ['email is not valid'],
      });
    }

    // hash the password
    const hashedPassword = await generateHash(password);

    const user = (
      await DB.getInstance()
        .insert(userTable)
        .values({
          email,
          fullName,
          avatarURL: avatarURL ?? null,
          passwordHash: hashedPassword,
          roleId: roleId,
        })
        .returning({
          id: userTable.id,
          email: userTable.email,
          fullName: userTable.fullName,
          createdAt: userTable.createdAt,
        })
    )[0];

    if (!user) {
      throw new Error('Failed to create user');
    }

    // refresh and access token
    const refreshToken = generateRefreshToken({
      userId: user.id,
    });

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

    if (!session) throw new Error('Failed to create an Session');

    const accessToken = generateAccessToken({
      userId: user.id,
      sessionId: session.id,
    });

    return res.status(201).json({
      success: true,
      message: 'New User created',
      data: { ...user, accessToken, refreshToken },
    });
  } catch (error) {
    logError('register controller', error);

    const pgError = error as PgError;
    if (pgError.code === '23505') {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
