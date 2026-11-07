import { Router } from 'express';

import { streamUpload } from '../middlewares/busboyStreamUpload.middleware.js';
import * as retailerController from '../controllers/retailer/index.js';
import { apiBodyValidator } from '../middlewares/validators/index.js';
import { createRetailerSchema } from '../api-schemas/retailer.schemas.js';

const retailerRouter = Router();

retailerRouter.post(
  '/register',
  streamUpload('shopPhoto', 'doodhsetu/retailers'),
  apiBodyValidator(createRetailerSchema),
  retailerController.registerRetailer,
);

export default retailerRouter;
