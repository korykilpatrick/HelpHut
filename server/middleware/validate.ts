import type { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { ParamsDictionary } from 'express-serve-static-core';
import type { ParsedQs } from 'qs';

type ValidateSchema = {
  body?: new (...args: any[]) => any;
  query?: new (...args: any[]) => any;
  params?: new (...args: any[]) => any;
};

export const validateRequest = (schema: ValidateSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schema.body) {
        const bodyInstance = plainToInstance(schema.body, req.body as object);
        const bodyErrors = await validate(bodyInstance);
        if (bodyErrors.length > 0) {
          return res.status(400).json({ errors: bodyErrors });
        }
        req.body = bodyInstance;
      }

      if (schema.query) {
        const queryInstance = plainToInstance(schema.query, req.query as ParsedQs);
        const queryErrors = await validate(queryInstance);
        if (queryErrors.length > 0) {
          return res.status(400).json({ errors: queryErrors });
        }
        req.query = queryInstance as ParsedQs;
      }

      if (schema.params) {
        const paramsInstance = plainToInstance(schema.params, req.params as ParamsDictionary);
        const paramsErrors = await validate(paramsInstance);
        if (paramsErrors.length > 0) {
          return res.status(400).json({ errors: paramsErrors });
        }
        req.params = paramsInstance as ParamsDictionary;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}; 