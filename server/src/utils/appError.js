class AppError extends Error {
  constructor(message, statusCode,name) {
    super(message);

    this.statusCode = statusCode;
    this .name=name || "error"
        Error.captureStackTrace(this, this.constructor);

  }
}

module.exports = AppError;