import { buildLogger } from "../../config";
import { HttpError } from "../../domain/errors/http.error";
import { Response } from "express";

export class HttpErrorHandler {

  private static logger = buildLogger("HttpErrorHandler");

  static handleError = (error: unknown, res: Response) => {

    if (error instanceof HttpError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    this.logger.error(`${error}`);
    return res.status(500).json({ error: "Internal server error" });
  };
}