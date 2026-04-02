import { ErrorProperty } from "../types/error.type";

export class AppError extends Error {
  description: ErrorProperty[] | null | string;
  statusCode: number;

  constructor(
    statusCode: number,
    message: string,
    description?: ErrorProperty[] | null | string
  ) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = Error.name;
    this.statusCode = statusCode;
    this.description = description !== undefined ? description : null;
    Error.captureStackTrace(this);
  }
}
