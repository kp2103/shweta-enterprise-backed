import { z } from 'zod';
import {
  createApiResponseSchema,
  messageOnlyResponseSchema,
  emailSchema,
  passwordSchema,
  roleSchema,
} from './core/index.js';

// ==========================================
// 1. REGISTER SCHEMAS
// ==========================================

export const registerBodySchema = z.object({
  fullName: z
    .string({ message: 'Full name is required' })
    .trim()
    .min(2, 'Full name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  role: roleSchema,
  avatarURL: z.string().url('Invalid avatar URL').optional(),
});

export const registerResponseSchema = createApiResponseSchema(
  z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    fullName: z.string(),
    createdAt: z.union([z.string(), z.date()]),
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
);

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type RegisterResponse = z.infer<typeof registerResponseSchema>;

// ==========================================
// 2. LOGIN SCHEMAS
// ==========================================

export const loginBodySchema = z.object({
  email: emailSchema,
  password: z
    .string({ message: 'Password is required' })
    .min(1, 'Password cannot be empty'),
});

export const loginResponseSchema = createApiResponseSchema(
  z.object({
    fullName: z.string(),
    email: z.string().email(),
    avatarURL: z.string().nullable().optional(),
    createdAt: z.union([z.string(), z.date()]),
    accessToken: z.string(),
    refreshToken: z.string(),
  }),
);

export type LoginBody = z.infer<typeof loginBodySchema>;
export type LoginResponse = z.infer<typeof loginResponseSchema>;

// ==========================================
// 3. ME (PROFILE) SCHEMAS
// ==========================================

export const meResponseSchema = createApiResponseSchema(
  z.object({
    fullName: z.string(),
    email: emailSchema,
    avatarURL: z.string().nullable().optional(),
    createdAt: z.union([z.string(), z.date()]),
    permissions: z.array(z.string())
  }),
);

export type MeResponse = z.infer<typeof meResponseSchema>;

// ==========================================
// 4. REFRESH TOKEN SCHEMAS
// ==========================================

export const refreshTokensBodySchema = z.object({
  refreshToken: z
    .string({ message: 'Refresh token is required' })
    .min(1, 'Refresh token cannot be empty'),
});

export const refreshTokensResponseSchema = createApiResponseSchema(
  z.object({
    accessToken: z.string(),
  }),
);

export type RefreshTokensBody = z.infer<typeof refreshTokensBodySchema>;
export type RefreshTokensResponse = z.infer<typeof refreshTokensResponseSchema>;

// ==========================================
// 5. LOGOUT SCHEMAS
// ==========================================

export const logoutResponseSchema = messageOnlyResponseSchema;
export type LogoutResponse = z.infer<typeof logoutResponseSchema>;

// ==========================================
// 6. USER ROLES SCHEMAS
// ==========================================

export const getUserRolesResponseSchema = createApiResponseSchema(
  z.object({
    userRoles: z.array(
      z.object({
        roleId: z.string().uuid(),
        role: roleSchema,
      }),
    ),
  }),
);

export type GetUserRolesResponse = z.infer<typeof getUserRolesResponseSchema>;
