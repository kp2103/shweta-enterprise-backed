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
  price: z.coerce
    .number({ message: 'Price must be a number' })
    .finite('Price must be a valid number')
    .min(0, 'Price cannot be negative'),
  // Stored in ml / base unit
  quantity: z.coerce
    .number({ message: 'Quantity must be a number' })
    .finite('Quantity must be a valid number')
    .positive('Quantity must be greater than 0'),
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

//* POST Create Product ceret
export const createProductCeretBodySchema = z.object({
  productId: z.uuid({ message: 'productId must be a valid UUID' }),
  unitsPerCrate: z.coerce
    .number()
    .int('unitPerCeret must be an integer')
    .positive('unitPerCeret must be in the positive number'),
  ceretPrice: z.coerce.number().min(0, {
    message: 'ceret price must be positive',
  }),
  isActive: z.boolean().optional(),
});

export const productCrateRecordSchema = z.object({
  id: z.string().trim(),
  productId: z.uuid(),
  unitsPerCrate: z.number(),
  cratePrice: z.number(),
  isActive: z.boolean(),
  createdAt: z.union([z.string(), z.date()]),
  updatedAt: z.union([z.string(), z.date()]),
});

export const productsCrateWithProductSchema = productCrateRecordSchema.extend({
  productName: z.string().trim(),
  productCategory: z.enum(PRODUCT_CATEGORIES),
});

export const createProductCeretResponseSchema = createApiResponseSchema(productCrateRecordSchema);

export type ProductCeretBody = z.infer<typeof createProductCeretBodySchema>;
export type ProductCeretResponse = z.infer<typeof createProductCeretResponseSchema>;

//* GET allProductsCrate response
export const getAllProductCratesResponseSchema = createApiResponseSchema(
  z.array(productsCrateWithProductSchema),
);
export type GetAllProductCratesResponse = z.infer<typeof getAllProductCratesResponseSchema>;

//* GET allProductsCrate query params
export const getAllProductCratesQueryParamsSchema = z.object({
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
    .default(10),
  productId: z.uuid({ message: 'productId must be a valid UUID' }).optional(),
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
export type GetAllProductCratesQuerySearch = z.infer<typeof getAllProductCratesQueryParamsSchema>;

//* DELETE Product Crate params and response
export const productCrateParamsSchema = z.object({
  productCrateId: z.uuid({ message: 'productCrateId must be a valid UUID' }),
});
export type ProductCrateParams = z.infer<typeof productCrateParamsSchema>;

export const deleteProductCrateResponseSchema = createApiResponseSchema(
  z.object({
    productCrateId: z.uuid(),
  }),
);
export type DeleteProductCrateResponse = z.infer<typeof deleteProductCrateResponseSchema>;

//* PATCH Update Product params, body and response
export const productIdParamsSchema = z.object({
  productId: z.uuid({ message: 'productId must be a valid UUID' }),
});
export type ProductIdParams = z.infer<typeof productIdParamsSchema>;

export const updateProductBodySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Product name must be at least 2 characters')
    .max(50, 'Product name must not exceed 50 characters')
    .optional(),
  description: z
    .string()
    .trim()
    .max(255, 'Description must not exceed 255 characters')
    .nullable()
    .optional(),
  unit: z
    .enum(PRODUCT_UNIT, {
      message: `Unit must be one of: ${PRODUCT_UNIT.join(', ')}`,
    })
    .optional(),
  price: z.coerce
    .number({ message: 'Price must be a number' })
    .finite('Price must be a valid number')
    .min(0, 'Price cannot be negative')
    .optional(),
  quantity: z.coerce
    .number({ message: 'Quantity must be a number' })
    .finite('Quantity must be a valid number')
    .positive('Quantity must be greater than 0')
    .optional(),
  category: z
    .enum(PRODUCT_CATEGORIES, {
      message: `Category must be one of: ${PRODUCT_CATEGORIES.join(', ')}`,
    })
    .optional(),
  isActive: z
    .preprocess((val) => {
      if (typeof val === 'string') return val.toLowerCase() === 'true';
      return val;
    }, z.boolean())
    .optional(),
});
export type UpdateProductBody = z.infer<typeof updateProductBodySchema>;

export const updateProductResponseSchema = createApiResponseSchema(productDataSchema);
export type UpdateProductResponse = z.infer<typeof updateProductResponseSchema>;

//* PATCH Update Product Crate body and response
export const updateProductCrateBodySchema = z
  .object({
    unitsPerCrate: z.coerce
      .number()
      .int('unitsPerCrate must be an integer')
      .positive('unitsPerCrate must be greater than 0')
      .optional(),
    cratePrice: z.coerce
      .number()
      .min(0, { message: 'cratePrice must be positive' })
      .optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.values(data).some((val) => val !== undefined), {
    message: 'At least one field must be provided to update',
  });
export type UpdateProductCrateBody = z.infer<typeof updateProductCrateBodySchema>;

export const updateProductCrateResponseSchema = createApiResponseSchema(productCrateParamsSchema);
export type UpdateProductCrateResponse = z.infer<typeof updateProductCrateResponseSchema>;