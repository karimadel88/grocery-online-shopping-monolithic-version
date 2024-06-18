const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UN_AUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

class AppError extends Error {
  readonly name: string;
  readonly statusCode: number;
  readonly isOperational: boolean;
  readonly errorStack: string;
  readonly logError: (error: Error) => void;

  constructor(
    name: string,
    statusCode: number,
    description: string,
    isOperational: boolean,
    errorStack?: string,
    logError?: (error: Error) => void,
  ) {
    super(description);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errorStack = errorStack || ""; // Set default empty string
    this.logError = logError || (() => {}); // Set default empty function
    Error.captureStackTrace(this, this.constructor); // Use constructor for stack trace
  }
}

//api Specific Errors
class APIError extends AppError {
  constructor(
    name: string,
    statusCode = STATUS_CODES.INTERNAL_ERROR,
    description = "Internal Server Error",
    isOperational = true,
  ) {
    super(name, statusCode, description, isOperational);
  }
}

//400
class BadRequestError extends AppError {
  constructor(description = "Bad request") {
    super("NOT FOUND", STATUS_CODES.BAD_REQUEST, description, true);
  }
}

//400
class ValidationError extends AppError {
  constructor(description = "Validation Error", errorStack: string) {
    super(
      "BAD REQUEST",
      STATUS_CODES.BAD_REQUEST,
      description,
      true,
      errorStack,
    );
  }
}

export { APIError, AppError, BadRequestError, STATUS_CODES, ValidationError };
