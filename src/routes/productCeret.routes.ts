import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { PERMISSION_CATALOGUE } from '../constants/permissions.const.js';
import { apiParamValidator } from '../middlewares/validators/apiParamValidator.middleware.js';
import { apiBodyValidator } from '../middlewares/validators/apiBodyValidator.middleware.js';
import { apiQuerySearchValidator } from '../middlewares/validators/apiQuerySearchValidator.middleware.js';
import {
  createProductCeretBodySchema,
  getAllProductCratesQueryParamsSchema,
  productCrateParamsSchema,
  updateProductCrateBodySchema,
} from '../api-schemas/products.schemas.js';
import * as productController from '../controllers/products/index.js';

const productCeretRouter = Router();

// Get All prodcutsCrate
productCeretRouter.get(
  '/',
  authMiddleware,
  requirePermission(PERMISSION_CATALOGUE.PRODUCT_VIEW),
  apiQuerySearchValidator(getAllProductCratesQueryParamsSchema),
  productController.getAllProductsCrateController,
);

// Get a detail productsCrate

// Post create a new productscreate 
productCeretRouter.post(
  '/',
  authMiddleware,
  requirePermission(PERMISSION_CATALOGUE.PRODUCT_CREATE),
  apiBodyValidator(createProductCeretBodySchema),
  productController.createProductCrateController,
);

// DELETE the Products Crate 
productCeretRouter.delete(
  '/:productCrateId',
  authMiddleware,
  requirePermission(PERMISSION_CATALOGUE.PRODUCT_DELETE),
  apiParamValidator(productCrateParamsSchema),
  productController.deleteProductCrateController,
);

// PATCH update a Product Crate
productCeretRouter.patch(
  '/:productCrateId',
  authMiddleware,
  requirePermission(PERMISSION_CATALOGUE.PRODUCT_UPDATE),
  apiParamValidator(productCrateParamsSchema),
  apiBodyValidator(updateProductCrateBodySchema),
  productController.updateProductCrateController,
);

export default productCeretRouter;