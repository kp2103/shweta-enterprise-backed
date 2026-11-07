import { z } from 'zod';

/** Standard success response wrapper with a data payload */
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    message: z.string(),
    data: dataSchema,
  });

/** Success response for actions without a data payload (e.g. logout) */
export const messageOnlyResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
});

/** Pagination metadata schema */
export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean(),
  hasPrevPage: z.boolean(),
});

/** Paginated list response wrapper */
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  createApiResponseSchema(
    z.object({
      items: z.array(itemSchema),
      pagination: paginationMetaSchema,
    }),
  );

export type ApiResponseSchema<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof createApiResponseSchema<T>>
>;
export type MessageOnlyResponse = z.infer<typeof messageOnlyResponseSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
