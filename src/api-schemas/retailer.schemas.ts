import { z } from 'zod';
import {
  createApiResponseSchema,
  emailSchema,
  phoneSchema,
  postalCodeSchema,
  latitudeSchema,
  longitudeSchema,
} from './core/index.js';

export const createRetailerSchema = z.object({
  email: emailSchema,
  fullName: z
    .string({ message: 'Full name is required' })
    .trim()
    .min(2, 'Full name is required'),
  shopName: z
    .string({ message: 'Shop name is required' })
    .trim()
    .min(2, 'Shop name is required'),
  gstNo: z
    .string({ message: 'GST number is required' })
    .trim()
    .min(1, 'GST number is required'),
  phone: phoneSchema,
  address: z
    .string({ message: 'Address is required' })
    .trim()
    .min(5, 'Address is required'),
  postalCode: postalCodeSchema,
  area: z
    .string({ message: 'Area is required' })
    .trim()
    .min(2, 'Area is required'),
  city: z
    .string({ message: 'City is required' })
    .trim()
    .min(2, 'City is required'),
  latitude: latitudeSchema.optional(),
  longitude: longitudeSchema.optional(),
});

export const createRetailerResponseSchema = createApiResponseSchema(
  z.object({
    shopName: z.string(),
    gstNo: z.string().nullable().optional(),
    phone: z.string(),
    shopPhotoUrl: z.string().nullable().optional(),
    address: z.string(),
    postalCode: z.string(),
    area: z.string(),
    city: z.string(),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
  }),
);

export type CreateRetailerSchema = z.infer<typeof createRetailerSchema>;
export type CreateRetailerResponse = z.infer<typeof createRetailerResponseSchema>;
