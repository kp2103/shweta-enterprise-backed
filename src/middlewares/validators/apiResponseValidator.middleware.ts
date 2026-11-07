import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';
import { logError } from '../../utils/logs.util.js';

export interface ControllerResponseData {
  statusCode?: number;
  payload: any;
}

export const apiResponseValidator = <T extends ZodType>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // If headers already sent (e.g. controller handled an error response directly), skip
    if (res.headersSent) {
      return next();
    }

    const responseData: ControllerResponseData | undefined = res.locals.response;

    if (!responseData) {
      logError('apiResponseValidator: Missing res.locals.response', {
        path: req.originalUrl,
        method: req.method,
      });

      return res.status(500).json({
        success: false,
        message: 'Internal server error: Response data not found',
      });
    }

    const statusCode = responseData.statusCode ?? 200;
    const payload = responseData.payload;

    const result = schema.safeParse(payload);

    if (!result.success) {
      logError('Response validation contract failed', {
        path: req.originalUrl,
        method: req.method,
        statusCode,
        issues: result.error.issues,
        payload,
      });

      return res.status(500).json({
        success: false,
        message: 'Internal server error: Response validation failed',
      });
    }

    return res.status(statusCode).json(result.data);
  };
};
