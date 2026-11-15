import { and, desc, eq, ilike } from 'drizzle-orm';
import { DB } from '../../config/dbConnect.js';
import {
  productCratesTable,
  type ProductCrateRecord,
} from '../../db/schemas/productCrates.schema.js';
import { PRODUCT_CATEGORIES, productsTable } from '../../db/schemas/products.schema.js';
import type { ServiceResult } from '../../types/service.types.js';
import { escapeLikePattern } from '../../utils/queryConditions.utils.js';
import { logError } from '../../utils/logs.util.js';

type GetAllProductsCrateError = 'INTERNAL_ERROR';

type GetProductsCrateQuerySearch = {
  offset: number;
  limit: number;
  productId?: string | undefined;
  search?: string | undefined;
  category?: (typeof PRODUCT_CATEGORIES)[number] | undefined;
  isActive?: boolean | undefined;
};

type ProductsCrateRecordsWithProduct = (ProductCrateRecord & {
  productName: string;
  productCategory: string;
})[];

export async function getAllProductsCrateService(
  querySearch: GetProductsCrateQuerySearch,
): Promise<ServiceResult<ProductsCrateRecordsWithProduct, GetAllProductsCrateError>> {
  const { limit, offset, productId, category, isActive, search } = querySearch;

  const conditions = [];

  if (productId) {
    conditions.push(eq(productCratesTable.productId, productId));
  }

  if (search) {
    const searchLike = escapeLikePattern(search.trim());
    if (searchLike) {
      conditions.push(ilike(productsTable.name, `%${searchLike}%`));
    }
  }

  if (category) {
    conditions.push(eq(productsTable.category, category));
  }

  if (isActive !== undefined) {
    conditions.push(eq(productCratesTable.isActive, isActive));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  try {
    const productCrates = await DB.getInstance()
      .select({
        id: productCratesTable.id,
        productId: productCratesTable.productId,
        productName: productsTable.name,
        productCategory: productsTable.category,
        unitsPerCrate: productCratesTable.unitsPerCrate,
        cratePrice: productCratesTable.cratePrice,
        isActive: productCratesTable.isActive,
        createdAt: productCratesTable.createdAt,
        updatedAt: productCratesTable.updatedAt,
      })
      .from(productCratesTable)
      .innerJoin(productsTable, eq(productsTable.id, productCratesTable.productId))
      .where(where)
      .orderBy(desc(productCratesTable.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      ok: true,
      message: 'Successfully retrieved all product crates',
      data: productCrates,
    };
  } catch (error) {
    logError('getAllProductsCrate service', error);

    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      message: 'Internal Server Error',
    };
  }
}
