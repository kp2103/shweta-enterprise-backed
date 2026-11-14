import type { Request, Response } from 'express';
import {
    getAllProductsResponseSchema,
    type GetAllProductQuerySearch,
} from '../../api-schemas/products.schemas.js';
import { getAllProductsService } from '../../services/products/getAllProduct.service.js';
import type { ApiResponse } from '../../types/api-response.types.js';
import { logError } from '../../utils/logs.util.js';
import { sendValidatedResponse } from '../../utils/response.util.js';

export async function getAllProductsController(
    req: Request,
    res: Response<ApiResponse>,
) {
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
