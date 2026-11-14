import { and, desc, eq, ilike } from 'drizzle-orm';
import { DB } from '../../config/dbConnect.js';
import { PRODUCT_CATEGORIES, productsTable } from '../../db/schemas/index.js';
import type { ServiceResult } from '../../types/service.types.js';
import { logError } from '../../utils/logs.util.js';
import type { ProductRecord } from '../../db/schemas/products.schema.js';

export type GetAllProductsErrorCode = 'INTERNAL_ERROR';

export interface GetProductsQuerySearch {
    offset: number;
    limit: number;
    search?: string | undefined;
    category?: typeof PRODUCT_CATEGORIES[number] | undefined;
    isActive?: boolean | undefined;
}

function escapeLikePattern(value: string): string {
    return value.replace(/[\\%_]/g, '\\$&');
}

/**
 * Fetches paginated and filtered products ordered from newest to oldest.
 */
export async function getAllProductsService(
    querySearch: GetProductsQuerySearch,
): Promise<ServiceResult<ProductRecord[], GetAllProductsErrorCode>> {
    const { limit, offset, category, isActive, search } = querySearch;

    const conditions = [];

    if (search) {
        const escapedSearch = escapeLikePattern(search.trim());
        if (escapedSearch) {
            conditions.push(ilike(productsTable.name, `%${escapedSearch}%`));
        }
    }

    if (isActive !== undefined) {
        conditions.push(eq(productsTable.isActive, isActive));
    }

    if (category) {
        conditions.push(eq(productsTable.category, category));
    }

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    try {
        const products = await DB.getInstance()
            .select()
            .from(productsTable)
            .where(where)
            .orderBy(desc(productsTable.createdAt))
            .limit(limit)
            .offset(offset);

        return {
            ok: true,
            message:
                products.length === 0
                    ? 'No products found'
                    : 'Products fetched successfully',
            data: products,
        };
    } catch (error: unknown) {
        logError('getAllProducts service', error);

        return {
            ok: false,
            code: 'INTERNAL_ERROR',
            statusCode: 500,
            message: 'Failed to fetch products',
            error,
        };
    }
}
