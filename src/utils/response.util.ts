import type { Response } from 'express';
import type { ZodType } from 'zod';
import { logError } from './logs.util.js';

/**
 * Validates the outgoing response payload against a Zod schema before sending it.
 * If validation fails, logs the error and sends a 500 Internal Server Error.
 */
export const sendValidatedResponse = <T extends ZodType>(
  res: Response,
  statusCode: number,
  schema: T,
  payload: any,
): Response => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    logError('Response validation contract failed', {
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

