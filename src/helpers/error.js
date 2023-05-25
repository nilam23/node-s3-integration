import { HTTP_STATUS_CODES } from './constants.js';
import { sendResponse } from './utils.js';

/**
 * @description
 * the application error class derived from the Error class
 */
export class AppError extends Error {
  constructor(message, statusCode, error) {
    super(message);

    this.statusCode = statusCode;
    this.isOperational = !!`${statusCode}`.startsWith('4');
    this.response = error || {};

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * @description
 * the following method is a centralized way to handle all application errors
 * @param {object} error the error object to be handled
 * @param {object} res the response object
 */
export const handleError = (error, _, res) => {
  const statusCode = error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
  delete error?.statusCode;

  sendResponse(
    res,
    statusCode,
    error.message || 'Internal Server Error',
    [],
    error
  );
};
