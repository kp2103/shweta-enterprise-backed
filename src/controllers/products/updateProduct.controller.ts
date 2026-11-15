import type { Request, Response } from 'express';
import type { ApiResponse } from '../../types/api-response.types.js';
import {
  updateProductResponseSchema,
  type ProductIdParams,
  type UpdateProductBody,
} from '../../api-schemas/products.schemas.js';
import {
  updateProduct as updateProductService,
  type UpdateProductPayload,
} from '../../services/products/updateProduct.service.js';
import { deleteFromCloudinary, deleteFromCloudinaryByUrl } from '../../utils/cloudinary.util.js';
import { logError } from '../../utils/logs.util.js';
import { sendValidatedResponse } from '../../utils/response.util.js';

export async function updateProductController(
  req: Request<ProductIdParams, ApiResponse, UpdateProductBody>,
  res: Response<ApiResponse>,
) {
  const { productId } = req.params;

  try {
    // Filter only defined fields from body
    const patch: UpdateProductPayload = {};
    if (req.body.name !== undefined) patch.name = req.body.name;
    if (req.body.description !== undefined) patch.description = req.body.description;
    if (req.body.unit !== undefined) patch.unit = req.body.unit;
    if (req.body.price !== undefined) patch.price = req.body.price;
    if (req.body.quantity !== undefined) patch.quantity = req.body.quantity;
    if (req.body.category !== undefined) patch.category = req.body.category;
    if (req.body.isActive !== undefined) patch.isActive = req.body.isActive;

    if (req.cloudinaryData?.url) {
      patch.imageUrl = req.cloudinaryData.url;
    }

    if (Object.keys(patch).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields provided to update',
      });
    }

    const result = await updateProductService({
      productId,
      patch,
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

    // Delete old image from Cloudinary if replaced
    if (
      req.cloudinaryData?.url &&
      result.data.oldImageUrl &&
      result.data.oldImageUrl !== req.cloudinaryData.url
    ) {
      await deleteFromCloudinaryByUrl(result.data.oldImageUrl);
    }

    return sendValidatedResponse(res, 200, updateProductResponseSchema, {
      success: true,
      message: result.message,
      data: result.data.product,
    });
  } catch (error: unknown) {
    logError('updateProduct controller', error);

    if (req.cloudinaryData?.publicId) {
      await deleteFromCloudinary(req.cloudinaryData.publicId);
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
