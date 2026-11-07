import type { Request, Response } from 'express';
import type { ApiResponse, PgError } from '../../types/api-response.types.js';
import { DB } from '../../config/dbConnect.js';
import { userTable } from '../../db/schemas/user.schema.js';
import { generateHash } from '../../utils/bcrypt.utils.js';
import { logError } from '../../utils/logs.util.js';
import { generateAccessToken, generateRefreshToken } from '../../utils/token.utils.js';
import { sessionTable } from '../../db/schemas/session.schema.js';
import { rolesTable, type RolesTypes } from '../../db/schemas/roles.schema.js';
import { eq } from 'drizzle-orm';
import { sendValidatedResponse } from '../../utils/response.util.js';
import { registerResponseSchema } from '../../api-schemas/auth.schemas.js';

interface RegisterUserBody {
  fullName: string;
  email: string;
  password: string;
  avatarURL: string | undefined;
  role: RolesTypes;
}

export async function register(
  req: Request<any, any, RegisterUserBody>,
  res: Response<ApiResponse>,
) {
  try {
    const { avatarURL, email, fullName, password, role } = req.body;

    // 1. Fetch role ID from role name
    const [roleRecord] = await DB.getInstance()
      .select({
        roleId: rolesTable.roleId,
      })
      .from(rolesTable)
      .where(eq(rolesTable.role, role))
      .limit(1);

    if (!roleRecord) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified: ${role}`,
      });
    }

    // Hash the password
    const hashedPassword = await generateHash(password);

    // 2. Perform atomic user creation and session creation in a transaction
    const { user, accessToken, refreshToken } = await DB.getInstance().transaction(
      async (tx) => {
        // A. Insert User
        const [newUser] = await tx
          .insert(userTable)
          .values({
            email,
            fullName,
            avatarURL: avatarURL ?? null,
            passwordHash: hashedPassword,
            roleId: roleRecord.roleId,
          })
          .returning({
            id: userTable.id,
            email: userTable.email,
            fullName: userTable.fullName,
            createdAt: userTable.createdAt,
          });

        if (!newUser) {
          throw new Error('Failed to create user');
        }

        // B. Generate tokens & Insert Session
        const newRefreshToken = generateRefreshToken({
          userId: newUser.id,
        });

        const refreshTokenHash = await generateHash(newRefreshToken);

        const [newSession] = await tx
          .insert(sessionTable)
          .values({
            userId: newUser.id,
            refreshTokenHash,
          })
          .returning({
            id: sessionTable.id,
          });

        if (!newSession) {
          throw new Error('Failed to create session');
        }

        const newAccessToken = generateAccessToken({
          userId: newUser.id,
          sessionId: newSession.id,
        });

        return {
          user: newUser,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        };
      },
    );

    // Validate response schema before sending
    return sendValidatedResponse(res, 201, registerResponseSchema, {
      success: true,
      message: 'New User created',
      data: { ...user, accessToken, refreshToken },
    });
  } catch (error: any) {
    const pgCode = error?.code || error?.cause?.code;

    // Handle duplicate key error (PostgreSQL unique_violation: 23505) without logging
    if (pgCode === '23505') {
      return res.status(409).json({
        success: false,
        message: 'A user with this email already exists',
      });
    }

    // Only log unexpected internal server errors
    logError('register controller', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
