import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema, ZodIssue } from "zod";

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

// Extend the Express Request interface to include validated data
declare global {
  namespace Express {
    interface Request {
      validatedBody?: any;
      validatedQuery?: any;
      validatedParams?: any;
    }
  }
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errorCode: string;
  public readonly details?: any;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    errorCode: string = "INTERNAL_ERROR",
    details?: any,
    isOperational: boolean = true
  ) {
    super(message);

    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const validate = (schemas: ValidationSchemas) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (schemas.body) {
        req.validatedBody = await schemas.body.parseAsync(req.body);
      }

      if (schemas.query) {
        req.validatedQuery = await schemas.query.parseAsync(req.query);
      }

      if (schemas.params) {
        req.validatedParams = await schemas.params.parseAsync(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = new AppError(
          "Validation failed",
          400,
          "VALIDATION_ERROR",
          formatZodErrors(error)
        );
        next(validationError);
      } else {
        next(error);
      }
    }
  };
};

/**
 * Formats Zod validation errors into a user-friendly format
 */
const formatZodErrors = (error: ZodError) => {
  return error.issues.map((err: ZodIssue) => ({
    field: err.path.join("."),
    message: err.message,
    code: err.code,
    received: (err as any).received || undefined,
    expected: getExpectedValue(err),
  }));
};

/**
 * Extracts expected value information from Zod errors
 */
const getExpectedValue = (err: ZodIssue) => {
  const anyErr = err as any;
  if (anyErr.expected) return anyErr.expected;
  if (anyErr.options) return anyErr.options;
  if (anyErr.unionErrors) return "one of the allowed values";
  return undefined;
};

/**
 * Helper function to get validated data from request
 * Falls back to original request properties if validation wasn't applied
 */
export const getValidatedData = (req: Request) => ({
  body: req.validatedBody || req.body,
  query: req.validatedQuery || req.query,
  params: req.validatedParams || req.params,
});
