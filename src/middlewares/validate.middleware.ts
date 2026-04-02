import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

import { STATUS_CODES } from "../constants/status";

export const validate =
  (schema: z.ZodObject<z.ZodRawShape>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: z.ZodIssue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        res.status(STATUS_CODES.BAD_REQUEST).json({
          message: "Validation error",
          description: errorMessages,
        });
        return;
      }
      next(error);
    }
  };
