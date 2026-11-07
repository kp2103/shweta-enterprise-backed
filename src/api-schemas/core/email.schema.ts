import { z } from 'zod';
import { EMAIL_REGEX } from '../../constants/regex.const.js';

export const emailSchema = z
  .string({ message: 'Email is required' })
  .trim()
  .toLowerCase()
  .regex(EMAIL_REGEX, 'Invalid email format');

// Backward compatibility alias
export const emailValidator = emailSchema;
export type EmailSchema = z.infer<typeof emailSchema>;
