import { DB } from '../../config/dbConnect.js';
import {
    productsTable,
    PRODUCT_CATEGORIES,
    PRODUCT_UNIT,
    type ProductRecord,
} from '../../db/schemas/products.schema.js';
import { logError } from '../../utils/logs.util.js';
import type { ServiceResult } from '../../types/service.types.js';

export type ProductUnit = (typeof PRODUCT_UNIT)[number];
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

export interface CreateProductInput {
    name: string;
    description?: string | null | undefined;
    unit: ProductUnit;
    price: number;
    quantity: number;
    category: ProductCategory;
    imageUrl?: string | null | undefined;
}

export type CreateProductErrorCode =
    | 'DUPLICATE_PRODUCT'
    | 'INVALID_INPUT'
    | 'CREATE_FAILED'
    | 'INTERNAL_ERROR';

interface PostgresLikeError {
    code?: unknown;
    cause?: unknown;
}

/**
 * Extracts a PostgreSQL error code from direct `pg` errors or Drizzle-wrapped query errors.
 */
function getPgErrorCode(error: unknown): string | undefined {
    if (typeof error !== 'object' || error === null) {
        return undefined;
    }

    const err = error as PostgresLikeError;
    if (typeof err.code === 'string') {
        return err.code;
    }

    if (typeof err.cause === 'object' && err.cause !== null) {
        const cause = err.cause as PostgresLikeError;
        if (typeof cause.code === 'string') {
            return cause.code;
        }
    }

    return undefined;
}

/**
 * Creates a new product record with normalized uppercase naming and duplicate handling.
 */
export async function createProduct(
    input: CreateProductInput,
): Promise<ServiceResult<ProductRecord, CreateProductErrorCode>> {
    // Store product names consistently in uppercase so unique constraint prevents case-variant duplicates
    const normalizedName = input.name.trim().toUpperCase();

    if (!normalizedName) {
        return {
            ok: false,
            code: 'INVALID_INPUT',
            statusCode: 400,
            message: 'Product name cannot be empty',
        };
    }

    try {
        const [product] = await DB.getInstance()
            .insert(productsTable)
            .values({
                name: normalizedName,
                description: input.description?.trim() || null,
                category: input.category,
                unit: input.unit,
                price: input.price,
                quantity: input.quantity,
                imageUrl: input.imageUrl ?? null,
            })
            .returning();

        if (!product) {
            return {
                ok: false,
                code: 'CREATE_FAILED',
                statusCode: 500,
                message: 'Failed to create product',
            };
        }

        return {
            ok: true,
            message: 'Product created successfully',
            data: product,
        };
    } catch (error: unknown) {
        const pgCode = getPgErrorCode(error);

        // Handle PostgreSQL unique_violation (23505) without logging expected client conflicts
        if (pgCode === '23505') {
            return {
                ok: false,
                code: 'DUPLICATE_PRODUCT',
                statusCode: 409,
                message: `Product "${normalizedName}" already exists`,
            };
        }

        logError('createProduct service', error);

        return {
            ok: false,
            code: 'INTERNAL_ERROR',
            statusCode: 500,
            message: 'Failed to create product',
            error,
        };
    }
}
