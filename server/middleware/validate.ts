import type { Request, Response, NextFunction } from 'express';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';
import { z } from 'zod';
import { toCamelCase } from '../../lib/utils/case-transform';

type ValidateSchema = {
  body?: z.ZodType<any>;
  query?: z.ZodType<any>;
  params?: z.ZodType<any>;
};

export const validateRequest = (schema: ValidateSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        console.log('Original request body:', req.body);
        
        // Transform to camelCase before validation
        const camelCaseBody = toCamelCase(req.body);
        console.log('Transformed to camelCase:', camelCaseBody);
        
        const result = schema.body.safeParse(camelCaseBody);
        if (!result.success) {
          console.error('Validation failed:', result.error.issues);
          return res.status(400).json({ errors: result.error.issues });
        }
        req.body = result.data;
        console.log('Validation passed, final body:', result.data);
      }

      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          return res.status(400).json({ errors: result.error.issues });
        }
        req.query = result.data as ParsedQs;
      }

      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          return res.status(400).json({ errors: result.error.issues });
        }
        req.params = result.data as ParamsDictionary;
      }

      next();
    } catch (error) {
      console.error('Unexpected validation error:', error);
      next(error);
    }
  };
}; 