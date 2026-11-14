import type { Request, Response, NextFunction } from 'express';
import type { ZodType, } from 'zod';

export const apiQuerySearchValidator = <T extends ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: 'Query validation failed',
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      });
    }

    req.query = result.data as any;
    next();
  };
};

