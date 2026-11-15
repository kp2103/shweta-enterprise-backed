import { eq } from "drizzle-orm";
import { DB } from "../../config/dbConnect.js";
import { productsTable } from "../../db/schemas/products.schema.js";
import type { ServiceResult } from "../../types/service.types.js";
import { logError } from "../../utils/logs.util.js";
import { productCratesTable } from "../../db/schemas/productCrates.schema.js";

type DeleteProductsErrorCodes = |
"INTERNAL_ERROR"
| "NOT_FOUND"


type DeleteProducResult = {
    productId : string
}

export async function deleteProduct(productId : string) : Promise<ServiceResult<DeleteProducResult,DeleteProductsErrorCodes>>
{
    try {
        const [product] = await DB.getInstance()
        .delete(productsTable)
        .where(
            eq(productsTable.id,productId)
        )
        .returning({
            productId : productsTable.id
        })

        if(!product)
        {
            return {
                ok : false,
                code : 'NOT_FOUND',
                message : "Product Does not eixts",
                statusCode : 404,
            }
        }

        return {
            ok : true,
            data : product,
            message : "Prodcut Deleted Successfully"
        }

    } catch (error) {
        
        logError("deleteProduct service",error)

        return {
            ok  : false,
            code : "INTERNAL_ERROR",
            message : "Internal Server Error",
            statusCode : 500,
            error,
        }
    }
}

type DeleteProductCrateResult = {
  productCrateId: string;
};

export async function deleteProductCrate(
  productCrateId: string,
): Promise<ServiceResult<DeleteProductCrateResult, DeleteProductsErrorCodes>> {
  try {
    const [productCrate] = await DB.getInstance()
      .delete(productCratesTable)
      .where(eq(productCratesTable.id, productCrateId))
      .returning({
        productCrateId: productCratesTable.id,
      });

    if (!productCrate) {
      return {
        ok: false,
        code: 'NOT_FOUND',
        message: 'Product crate does not exist',
        statusCode: 404,
      };
    }

    return {
      ok: true,
      data: productCrate,
      message: 'Product crate deleted successfully',
    };
  } catch (error) {
    logError('deleteProductCrate service', error);

    return {
      ok: false,
      code: 'INTERNAL_ERROR',
      message: 'Internal Server Error',
      statusCode: 500,
      error,
    };
  }
}