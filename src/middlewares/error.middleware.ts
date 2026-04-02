import { NextFunction, Request, Response } from "express";

import { ErrorProperty } from "../types/error.type";

interface CustomError extends Error {
  description?: ErrorProperty[] | string;
  statusCode: number;
}

export const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  const errorResponse = {
    message: err.message ? err.message : "Server Error",
    ...(err.description && { description: err.description }),
  };
  const statusCode = err.statusCode ? err.statusCode : 500;

  res.status(statusCode).json(errorResponse);
};
