import type { Request, Response } from 'express';
import {
  createProductResponseSchema,
  type CreateProductBody,
} from '../../api-schemas/products.schemas.js';
import { createProduct as createProductService } from '../../services/products/createProduct.service.js';
import type { ApiResponse } from '../../types/api-response.types.js';
import { deleteFromCloudinary } from '../../utils/cloudinary.util.js';
import { logError } from '../../utils/logs.util.js';
import { sendValidatedResponse } from '../../utils/response.util.js';

export async function createProduct(
  req: Request<Record<string, string>, ApiResponse, CreateProductBody>,
  res: Response<ApiResponse>,
) {
  try {
    const { name, description, unit, price, quantity, imageUrl, category } = req.body;

    const result = await createProductService({
      name,
      description: description ?? null,
      unit,
      price,
      quantity,
      category,
      imageUrl: req.cloudinaryData?.url ?? imageUrl ?? null,
    });

    if (!result.ok) {
      if (req.cloudinaryData?.publicId) {
        await deleteFromCloudinary(req.cloudinaryData.publicId);
      }

      return res.status(result.statusCode).json({
        success: false,
        message: result.message,
      });
    }

    return sendValidatedResponse(res, 201, createProductResponseSchema, {
      success: true,
      message: result.message,
      data: result.data,
    });
  } catch (error: unknown) {
    logError('createProduct controller', error);

    if (req.cloudinaryData?.publicId) {
      await deleteFromCloudinary(req.cloudinaryData.publicId);
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}

