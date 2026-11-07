
import { Router } from "express";

import { streamUpload } from "../middlewares/busboyStreamUpload.middleware.js";
import { createRetailerSchema } from "../middlewares/validators/retailer.validator.js";

import * as retailerController from "../controllers/retailer/index.js";
import { validateData } from "../middlewares/validateDate.middleware.js";

const retailerRouter = Router();

retailerRouter.post(
  "/register",
  streamUpload(
    "shopPhoto",
    "doodhsetu/retailers",
  ),
  validateData(createRetailerSchema),
  retailerController.registerRetailer,
);

export default retailerRouter;
