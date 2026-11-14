import { Router } from 'express';
import { createProductBodySchema, getAllProductsQueryParamsSchema } from '../api-schemas/products.schemas.js';
import { PERMISSION_CATALOGUE } from '../constants/permissions.const.js';
import * as productController from '../controllers/products/index.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { apiBodyValidator } from '../middlewares/validators/apiBodyValidator.middleware.js';
import { apiQuerySearchValidator } from '../middlewares/validators/apiQuerySearchValidator.middleware.js';

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
  apiBodyValidator(createProductBodySchema),
  productController.createProduct,
);

export default productRouter;
