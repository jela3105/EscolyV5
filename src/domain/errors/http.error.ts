export class HttpError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly message: string
  ) {
    super(message);
  }

  static badRequest(message: string): HttpError {
    return new HttpError(400, message);
  }

  static unauthorized(message: string): HttpError {
    return new HttpError(401, message);
  }

  static forbidden(message: string): HttpError {
    return new HttpError(403, message);
  }

  static notFound(message: string): HttpError {
    return new HttpError(404, message);
  }

  static conflict(message: string): HttpError {
    return new HttpError(409, message);
  }

  static internalServerError(
    message: string = "Internal Server Error"
  ): HttpError {
    return new HttpError(500, message);
  }
}
