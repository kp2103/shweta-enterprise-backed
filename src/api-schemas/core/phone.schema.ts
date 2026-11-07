import { z } from 'zod';
import { PHONE_NO } from '../../constants/regex.const.js';

export const phoneSchema = z
  .string({ message: 'Phone number is required' })
  .trim()
  .regex(PHONE_NO, 'Invalid phone number format');

// Backward compatibility alias
export const phoneValidator = phoneSchema;
export type PhoneSchema = z.infer<typeof phoneSchema>;
