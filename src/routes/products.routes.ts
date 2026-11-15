import { Router } from 'express';
import {
  createProductBodySchema,
  getAllProductsQueryParamsSchema,
  productIdParamsSchema,
  updateProductBodySchema,
} from '../api-schemas/products.schemas.js';
import { PERMISSION_CATALOGUE } from '../constants/permissions.const.js';
import * as productController from '../controllers/products/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { apiBodyValidator } from '../middlewares/validators/apiBodyValidator.middleware.js';
import { apiParamValidator } from '../middlewares/validators/apiParamValidator.middleware.js';
import { apiQuerySearchValidator } from '../middlewares/validators/apiQuerySearchValidator.middleware.js';
import { streamUpload } from '../middlewares/busboyStreamUpload.middleware.js';
import { env } from '../config/env.js';

const productRouter = Router();

// GET all products
productRouter.get(
  '/',
  authMiddleware,
  requirePermission(PERMISSION_CATALOGUE.PRODUCT_VIEW),
  apiQuerySearchValidator(getAllProductsQueryParamsSchema),
  productController.getAllProductsController,
);

// POST a new Product
productRouter.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSION_CATALOGUE.PRODUCT_CREATE),
  streamUpload('productImage', `${env.CLOUDINARY_FOLDER_NAME}/products`),
  apiBodyValidator(createProductBodySchema),
  productController.createProduct,
);

// PATCH update a product
productRouter.patch(
  '/:productId',
  authMiddleware,
  requirePermission(PERMISSION_CATALOGUE.PRODUCT_UPDATE),
  apiParamValidator(productIdParamsSchema),
  streamUpload('productImage', `${env.CLOUDINARY_FOLDER_NAME}/products`, true),
  apiBodyValidator(updateProductBodySchema),
  productController.updateProductController,
);

export default productRouter;
