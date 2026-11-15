import type { Request, Response } from 'express';
import {
  getAllProductCratesResponseSchema,
  getAllProductsResponseSchema,
  type GetAllProductCratesQuerySearch,
  type GetAllProductQuerySearch,
} from '../../api-schemas/products.schemas.js';
import { getAllProductsService } from '../../services/products/getAllProduct.service.js';
import type { ApiResponse } from '../../types/api-response.types.js';
import { logError } from '../../utils/logs.util.js';
import { sendValidatedResponse } from '../../utils/response.util.js';
import { getAllProductsCrateService } from '../../services/products/getAllProductCrates.service.js';

export async function getAllProductsController(req: Request, res: Response<ApiResponse>) {
  try {
    // Validated and coerced by `apiQuerySearchValidator(getAllProductsQueryParamsSchema)`
    const { page, limit, search, isActive, category } =
      req.query as unknown as GetAllProductQuerySearch;

    const result = await getAllProductsService({
      limit,
      offset: (page - 1) * limit,
      category,
      isActive,
      search,
    });

    if (!result.ok) {
      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return sendValidatedResponse(res, 200, getAllProductsResponseSchema, {
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: unknown) {
    logError('getAllProducts controller', error);

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

export async function getAllProductsCrateController(
  req: Request,
  res: Response<ApiResponse>,
) {
  try {
    const { limit, page, productId, category, isActive, search } =
      req.query as unknown as GetAllProductCratesQuerySearch;

    const productsCratesResult = await getAllProductsCrateService({
      limit,
      offset: (page - 1) * limit,
      productId,
      category,
      isActive,
      search,
    });

    if (!productsCratesResult.ok) {
      return res.status(productsCratesResult.statusCode).json({
        success: false,
        message: productsCratesResult.message,
      });
    }

    return sendValidatedResponse(res, 200, getAllProductCratesResponseSchema, {
      success: true,
      message: productsCratesResult.message,
      data: productsCratesResult.data,
    });
  } catch (error) {
    logError('getAllProductsCrate Controller', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
}
