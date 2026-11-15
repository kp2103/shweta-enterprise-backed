import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response.types.js';
import {
  updateProductCrateResponseSchema,
  type ProductCrateParams,
  type UpdateProductCrateBody,
} from '../../api-schemas/products.schemas.js';
import {
  updateProductCrate as updateProductCrateService,
  type UpdateProductCratePayload,
} from '../../services/products/updateProduct.service.js';
import { logError } from '../../utils/logs.util.js';
import { sendValidatedResponse } from '../../utils/response.util.js';

export async function updateProductCrateController(
  req: Request<ProductCrateParams, ApiResponse, UpdateProductCrateBody>,
  res: Response<ApiResponse>,
) {
  const { productCrateId } = req.params;

  try {
    // Filter only defined fields from body
    const patch: UpdateProductCratePayload = {};
    if (req.body.unitsPerCrate !== undefined) patch.unitsPerCrate = req.body.unitsPerCrate;
    if (req.body.cratePrice !== undefined) patch.cratePrice = req.body.cratePrice;
    if (req.body.isActive !== undefined) patch.isActive = req.body.isActive;

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided to update',
      });
    }

    const result = await updateProductCrateService({
      productCrateId,
      patch,
    });

    if (!result.ok) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return sendValidatedResponse(res, 200, updateProductCrateResponseSchema, {
      success: true,
      message: result.message,
      data: {
        productCrateId: result.data.id,
      },
    });
  } catch (error: unknown) {
    logError('updateProductCrate controller', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
