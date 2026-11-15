import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response.types.js';
import {
  deleteProductCrateResponseSchema,
  type ProductCrateParams,
} from '../../api-schemas/products.schemas.js';
import { deleteProductCrate } from '../../services/products/deleteProducts.service.js';
import { sendValidatedResponse } from '../../utils/response.util.js';
import { logError } from '../../utils/logs.util.js';

export async function deleteProductCrateController(
  req: Request<ProductCrateParams>,
  res: Response<ApiResponse>,
) {
  const { productCrateId } = req.params;

  try {
    const result = await deleteProductCrate(productCrateId);

    if (!result.ok) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return sendValidatedResponse(res, 200, deleteProductCrateResponseSchema, {
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error) {
    logError('deleteProductCrate controller', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
