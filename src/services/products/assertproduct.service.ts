import { eq } from 'drizzle-orm';
import { DB } from '../../config/dbConnect.js';
import { productsTable, type ProductRecord } from '../../db/schemas/products.schema.js';
import type { ServiceResult } from '../../types/service.types.js';
import { logError } from '../../utils/logs.util.js';

type AssertProductErrorCode = 'PRODUCT_NOT_FOUND' | 'INTERNAL_ERROR';

export async function assertProduct(input: {
  productId: string;
}): Promise<ServiceResult<ProductRecord, AssertProductErrorCode>> {
  try {
    // 1. Check parent product exists
    const [product] = await DB.getInstance()
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, input.productId))
      .limit(1);

    if (!product) {
      return {
        ok: false as const,
        code: 'PRODUCT_NOT_FOUND' as const,
        statusCode: 404,
        message: 'Product does not exist',
      };
    }

    return {
        ok : true as const,
        message : "Product Found",
        data : product
    }
  } catch (error) {
    logError('assert product service', error);

    return {
      ok: false as const,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      message: 'Internal Server Error',
      error: error,
    };
  }
}
