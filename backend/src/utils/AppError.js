class AppError extends Error {
  constructor(message, statusCode, errorCode = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
     

    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types for better organization
class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401, 'AUTHENTICATION_ERROR');
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403, 'AUTHORIZATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
  }
}
class EmailAlreadyExistsError extends AppError {
  constructor(email) {
    super(`Email ${email} already exists!`, 409, 'EMAIL_EXISTS_ERROR');
  }
}

class DuplicateKeyError extends AppError {
  constructor(field, value) {
    super(`${field} '${value}' already exists`, 409, 'DUPLICATE_KEY_ERROR');
  }
}

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  DuplicateKeyError
};