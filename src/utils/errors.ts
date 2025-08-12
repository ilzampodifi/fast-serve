import { Request, Response, NextFunction } from "express";
import { AppError } from "@/middleware/validation.middleware";

/**
 * Production-grade error response interface
 */
export interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
    timestamp: string;
    path: string;
    method: string;
  };
}

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let error = err;

  // Convert non-AppError instances to AppError
  if (!(err instanceof AppError)) {
    // Handle specific error types
    if (err.name === "ValidationError") {
      error = new AppError(
        "Validation Error",
        400,
        "VALIDATION_ERROR",
        err.message
      );
    } else if (err.name === "CastError") {
      error = new AppError("Invalid ID format", 400, "INVALID_ID", err.message);
    } else if (err.name === "MongoError" && (err as any).code === 11000) {
      error = new AppError(
        "Duplicate field value",
        409,
        "DUPLICATE_ERROR",
        err.message
      );
    } else {
      error = new AppError("Internal Server Error", 500, "INTERNAL_ERROR", err.message);
    }
  }

  const appError = error as AppError;

  // Prepare error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      message: appError.message,
      code: appError.errorCode,
      statusCode: appError.statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      ...(appError.details && { details: appError.details }),
    },
  };

  // Log error for debugging (in production, use proper logging service)
  if (appError.statusCode >= 500) {
    console.error("🚨 Server Error:", {
      error: appError.message,
      stack: appError.stack,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    });
  } else {
    console.warn("⚠️  Client Error:", {
      error: appError.message,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip,
    });
  }

  res.status(appError.statusCode).json(errorResponse);
};

/**
 * Async error wrapper for controllers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new AppError(
    `Route ${req.originalUrl} not found`,
    404,
    "ROUTE_NOT_FOUND"
  );
  next(error);
};
