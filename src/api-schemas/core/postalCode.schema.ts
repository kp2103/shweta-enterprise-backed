import { z } from 'zod';
import { POSTAL_CODE } from '../../constants/regex.const.js';

export const postalCodeSchema = z
  .string({ message: 'Postal code is required' })
  .trim()
  .regex(POSTAL_CODE, 'Invalid postal code format');

// Backward compatibility alias
export const postalCodeValidator = postalCodeSchema;
export type PostalCodeSchema = z.infer<typeof postalCodeSchema>;
