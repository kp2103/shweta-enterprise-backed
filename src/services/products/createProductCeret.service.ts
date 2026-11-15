import { DB } from '../../config/dbConnect.js';
import {
  productCratesTable,
  type ProductCrateRecord,
} from '../../db/schemas/productCrates.schema.js';
import type { ServiceResult } from '../../types/service.types.js';
import { logError } from '../../utils/logs.util.js';

export interface NewProductCeret {
  productId: string;
  unitsPerCrate: number;
  cratePrice: number;
  isActive?: boolean | undefined;
}

export type CreateProductCeretErrorCode =
  | 'PRODUCT_NOT_FOUND'
  | 'DUPLICATE_CRATE'
  | 'DUPLICATE_PRODUCT'
  | 'INVALID_INPUT'
  | 'CREATE_FAILED'
  | 'INTERNAL_ERROR';

export async function createProductCeretService(
  input: NewProductCeret,
): Promise<ServiceResult<ProductCrateRecord, CreateProductCeretErrorCode>> {
  try {
    const result = await DB.getInstance().transaction(async (tx) => {
      

      // 2. Insert with onConflictDoNothing matching unique constraint (productId, unitsPerCrate)
      const [productCrate] = await tx
        .insert(productCratesTable)
        .values({
          productId: input.productId,
          cratePrice: input.cratePrice,
          unitsPerCrate: input.unitsPerCrate,
          isActive: input.isActive ?? true,
        })
        .onConflictDoNothing({
          target: [productCratesTable.productId, productCratesTable.unitsPerCrate],
        })
        .returning();

      // If conflict occurred, onConflictDoNothing returns empty array
      if (!productCrate) {
        return {
          ok: false as const,
          code: 'DUPLICATE_CRATE' as const,
          statusCode: 409,
          message: `A crate with ${input.unitsPerCrate} units already exists for this product`,
        };
      }

      return {
        ok: true as const,
        data: productCrate,
        message: 'Product crate created successfully',
      };
    });

    return result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const pgCode = error?.code || error?.cause?.code;

    if (pgCode === '23505') {
      return {
        ok: false,
        code: 'DUPLICATE_CRATE',
        statusCode: 409,
        message: `A crate with ${input.unitsPerCrate} units already exists for this product`,
      };
    }

    if (pgCode === '23503') {
      return {
        ok: false,
        code: 'PRODUCT_NOT_FOUND',
        statusCode: 404,
        message: 'Product not found',
      };
    }

    logError('createProductCeret service', error);
    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
      message: 'Failed to create product crate',
      error,
    };
  }
}
