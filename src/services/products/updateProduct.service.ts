import { eq } from "drizzle-orm";
import { DB } from "../../config/dbConnect.js";
import { productsTable, type ProductRecord } from "../../db/schemas/products.schema.js";
import type { ServiceResult } from "../../types/service.types.js";
import { logError } from "../../utils/logs.util.js";
import { productCratesTable, type ProductCrateRecord } from "../../db/schemas/productCrates.schema.js";

type UpdateProductErrorCode = |
    "NOT_FOUND"
    | "INTERNAL_ERROR"

export type UpdateProductPayload = {
    name?: string;
    description?: string | null;
    unit?: ProductRecord['unit'];
    price?: number;
    quantity?: number;
    imageUrl?: string | null;
    category?: ProductRecord['category'];
    isActive?: boolean;
};

export type UpdateProduct = {
    productId: string;
    patch: UpdateProductPayload;
};

export type UpdateProductResult = {
    product: ProductRecord;
    oldImageUrl?: string | null;
};

export async function updateProduct(input: UpdateProduct): Promise<ServiceResult<UpdateProductResult, UpdateProductErrorCode>> {
    try {
        const [existingProduct] = await DB.getInstance()
            .select({
                imageUrl: productsTable.imageUrl,
            })
            .from(productsTable)
            .where(eq(productsTable.id, input.productId));

        if (!existingProduct) {
            return {
                ok: false,
                code: 'NOT_FOUND',
                message: "Product not found",
                statusCode: 404,
            };
        }

        const [updatedProduct] = await DB.getInstance().update(productsTable)
            .set(input.patch)
            .where(
                eq(productsTable.id, input.productId)
            )
            .returning();

        if (!updatedProduct) {
            return {
                ok: false,
                code: 'NOT_FOUND',
                message: "Product not found",
                statusCode: 404,
            };
        }

        return {
            ok: true,
            data: {
                product: updatedProduct,
                oldImageUrl: existingProduct.imageUrl,
            },
            message: "Product updated successfully"
        };
    } catch (error) {
        logError('updateProduct service', error);

        return {
            ok: false,
            code: 'INTERNAL_ERROR',
            message: "Internal Server Error",
            statusCode: 500,
            error
        }
    }
}


// UPDATE the product crate

export type UpdateProductCratePayload = {
    unitsPerCrate?: number;
    cratePrice?: number;
    isActive?: boolean;
};

export type UpdateProductCrate = {
    productCrateId: string;
    patch: UpdateProductCratePayload;
};

export async function updateProductCrate(input: UpdateProductCrate)
    : Promise<ServiceResult<ProductCrateRecord, UpdateProductErrorCode>> {
    try {

        const [updatedProductCrate] = await DB.getInstance().update(productCratesTable)
            .set(input.patch)
            .where(
                eq(productCratesTable.id, input.productCrateId)
            )
            .returning()

        if (!updatedProductCrate)
            return {
                code: 'NOT_FOUND',
                ok: false,
                message: "Product Crate is not found",
                statusCode: 404
            }

        return {
            ok: true,
            data: updatedProductCrate,
            message: "Product Crate is updated Successfully"
        }

    } catch (error) {
        logError('update ProdcutCrate service', error)

        return {
            ok: false,
            code: 'INTERNAL_ERROR',
            message: "Internal Server Error",
            statusCode: 500,
            error
        }
    }
}