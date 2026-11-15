import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response.types.js';
import {
  createProductCeretResponseSchema,
  type ProductCeretBody,
} from '../../api-schemas/products.schemas.js';
import { createProductCeretService } from '../../services/products/createProductCeret.service.js';
import { sendValidatedResponse } from '../../utils/response.util.js';
import { logError } from '../../utils/logs.util.js';

export async function createProductCrateController(
  req: Request<unknown, null, ProductCeretBody>,
  res: Response<ApiResponse>,
) {
  const { ceretPrice, productId, unitsPerCrate, isActive } = req.body;

  try {
    const productCrateResult = await createProductCeretService({
      cratePrice: ceretPrice,
      productId,
      unitsPerCrate,
      isActive,
    });

    if (!productCrateResult.ok) {
      return res.status(productCrateResult.statusCode).json({
        success: false,
        message: productCrateResult.message,
      });
    }

    return sendValidatedResponse(res, 201, createProductCeretResponseSchema, {
      success: true,
      message: productCrateResult.message,
      data: productCrateResult.data,
    });
  } catch (error) {
    logError('createProductCrate controller', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
