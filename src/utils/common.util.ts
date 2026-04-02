import { NextFunction, Request, Response } from 'express';

export const asyncMiddleware =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
    (req: Request, res: Response, next: NextFunction) => {
      void fn(req, res, next).catch(next);
    };

/**
 * Converts a number to its ordinal suffix (1st, 2nd, 3rd, 4th, etc.)
 */
export const getOrdinalSuffix = (num: number): string => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) {
    return "st";
  }
  if (j === 2 && k !== 12) {
    return "nd";
  }
  if (j === 3 && k !== 13) {
    return "rd";
  }
  return "th";
};

