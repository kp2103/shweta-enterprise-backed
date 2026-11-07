import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { deleteFromCloudinary } from '../../utils/cloudinary.util.js';
import { logError } from '../../utils/logs.util.js';

export const apiBodyValidator = <T extends ZodType>(schema: T) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      if (req.cloudinaryData) {
        try {
          await deleteFromCloudinary(req.cloudinaryData.publicId);
          req.cloudinaryData = undefined;
        } catch (error) {
          logError('Cloudinary validation cleanup failed', error);
        }
      }

      return res.status(400).json({
        success: false,
        message: 'Body validation failed',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    req.body = result.data;
    next();
  };
};

