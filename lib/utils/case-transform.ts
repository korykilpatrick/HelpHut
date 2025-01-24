import { camelCase, snakeCase } from 'lodash-es';

type CaseTransformResult<T> = T extends (infer U)[]
  ? { [K in keyof U]: any }[]
  : { [key: string]: any };

/**
 * Transforms an object's keys from snake_case to camelCase
 */
export function toCamelCase<T extends object>(obj: T): CaseTransformResult<T> {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v)) as CaseTransformResult<T>;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key as keyof T];
      const camelKey = camelCase(key);
      result[camelKey] = value !== null && typeof value === 'object'
        ? toCamelCase(value)
        : value;
      return result;
    }, {} as { [key: string]: any }) as CaseTransformResult<T>;
  }
  return obj as CaseTransformResult<T>;
}

/**
 * Transforms an object's keys from camelCase to snake_case
 */
export function toSnakeCase<T extends object>(obj: T): CaseTransformResult<T> {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v)) as CaseTransformResult<T>;
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((result, key) => {
      const value = obj[key as keyof T];
      const snakeKey = snakeCase(key);
      result[snakeKey] = value !== null && typeof value === 'object'
        ? toSnakeCase(value)
        : value;
      return result;
    }, {} as { [key: string]: any }) as CaseTransformResult<T>;
  }
  return obj as CaseTransformResult<T>;
}

/**
 * Type-safe wrapper for database operations that handles case transformations
 */
export function withCaseTransform<T extends object, R>(
  dbOperation: (data: T) => Promise<R>,
  inputData: T
): Promise<R> {
  // Convert input to snake_case for database
  const snakeCaseData = toSnakeCase(inputData);
  
  // Execute database operation
  return dbOperation(snakeCaseData as unknown as T).then(result => {
    // Convert result back to camelCase for API
    return toCamelCase(result as object) as R;
  });
} 
