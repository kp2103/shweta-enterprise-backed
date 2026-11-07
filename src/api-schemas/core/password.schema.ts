import { z } from 'zod';
import { PASSWORD_REGEX } from '../../constants/regex.const.js';

export const passwordSchema = z
  .string({ message: 'Password is required' })
  .regex(
    PASSWORD_REGEX,
    'Password must be at least 8 characters and include uppercase, lowercase, number, and special character',
  );

// Backward compatibility alias
export const passwordValidator = passwordSchema;
export type PasswordSchema = z.infer<typeof passwordSchema>;
