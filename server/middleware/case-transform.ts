import { Request, Response, NextFunction } from 'express';
import { toCamelCase, toSnakeCase } from '../../lib/utils/case-transform';

/**
 * Middleware that transforms request bodies from camelCase to snake_case
 * and response bodies from snake_case to camelCase
 */
export function caseTransformMiddleware(req: Request, res: Response, next: NextFunction) {
  // Store the original json method
  const originalJson = res.json;

  // Transform request body to snake_case if it exists
  if (req.body && typeof req.body === 'object') {
    req.body = toSnakeCase(req.body);
  }

  // Override json method to transform response to camelCase
  res.json = function(body: any) {
    if (body && typeof body === 'object') {
      body = toCamelCase(body);
    }
    return originalJson.call(this, body);
  };

  next();
} 