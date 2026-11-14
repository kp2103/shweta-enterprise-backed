import { z } from 'zod';
import { PRODUCT_CATEGORIES, PRODUCT_UNIT } from '../db/schemas/products.schema.js';
import { createApiResponseSchema } from './core/index.js';

const HTTPS_URL_REGEX = /^https:\/\//i;

//* POST create a new Product
export const createProductBodySchema = z.object({
  name: z
    .string({ message: 'Product name is required' })
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .max(50, 'Product name must not exceed 50 characters'),
  description: z
    .string()
    .trim()
    .max(255, 'Description must not exceed 255 characters')
    .nullable()
    .optional(),
  unit: z.enum(PRODUCT_UNIT, {
    message: `Unit must be one of: ${PRODUCT_UNIT.join(', ')}`,
  }),
  // Stored in paise
  price: z
    .number({ message: 'Price must be a number' })
    .finite('Price must be a valid number')
    .min(0, 'Price cannot be negative'),
  // Stored in ml / base unit
  quantity: z
    .number({ message: 'Quantity must be a number' })
    .finite('Quantity must be a valid number')
    .positive('Quantity must be greater than 0'),
  imageUrl: z
    .url('Invalid image URL')
    .regex(HTTPS_URL_REGEX, 'Image URL must start with https://')
    .max(255, 'Image URL must not exceed 255 characters')
    .nullable()
    .optional(),
  category: z.enum(PRODUCT_CATEGORIES, {
    message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
  }),
});

export const productDataSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  description: z.string().nullable(),
  unit: z.enum(PRODUCT_UNIT),
  price: z.number(),
  quantity: z.number().positive(),
  imageUrl: z.string().nullable(),
  category: z.enum(PRODUCT_CATEGORIES),
  isActive: z.boolean(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const createProductResponseSchema = createApiResponseSchema(productDataSchema);

export type CreateProductBody = z.infer<typeof createProductBodySchema>;
export type CreateProductResponse = z.infer<typeof createProductResponseSchema>;


//* GET all products

// Query Params
export const getAllProductsQueryParamsSchema = z.object({
  page: z.coerce
    .number({ message: 'Page number must be a number' })
    .int('Page number must be an integer')
    .min(1, 'Page number must be at least 1')
    .default(1),
  limit: z.coerce
    .number({ message: 'Page size must be a number' })
    .int('Page size must be an integer')
    .min(5, 'Page size must be at least 5')
    .max(100, 'Page size must not exceed 100')
    .default(5),
  search: z
    .string()
    .trim()
    .transform((val) => val || undefined)
    .optional(),
  category: z
    .enum(PRODUCT_CATEGORIES, {
      message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
    })
    .optional(),
  isActive: z
    .enum(['true', 'false'], {
      message: 'isActive must be true or false',
    })
    .transform((val) => val === 'true')
    .optional(),
});
export type GetAllProductQuerySearch = z.infer<typeof getAllProductsQueryParamsSchema>;

export const getAllProductsResponseSchema = createApiResponseSchema(z.array(productDataSchema));
export type GetAllProductsResponse = z.infer<typeof getAllProductsResponseSchema>;