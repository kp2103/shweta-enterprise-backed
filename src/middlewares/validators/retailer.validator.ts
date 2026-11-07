// middlewares/validators/retailer.validator.ts
import { z } from 'zod';
import { EMAIL_REGEX, PHONE_NO, POSTAL_CODE } from '../../constants/regex.const.js';

export const createRetailerSchema = z.object({
  email: z.string().regex(EMAIL_REGEX, 'Invalid email format'),
  fullName: z.string().min(2, 'Full name is required'),
  shopName: z.string().min(2, 'Shop name is required'),
  gstNo: z.string().min(1, 'GST number is required'),
  phone: z.string().regex(PHONE_NO, 'Invalid phone number'),
  address: z.string().min(5, 'Address is required'),
  postalCode: z.string().regex(POSTAL_CODE, 'Invalid postal code'),
  area: z.string().min(2, 'Area is required'),
  city: z.string().min(2, 'City is required'),
  latitude: z.coerce.number().min(-90).max(90), 
  longitude: z.coerce.number().min(-180).max(180),
});

export type CreateRetailerSchema = z.infer<typeof createRetailerSchema>