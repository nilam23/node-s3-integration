/**
 * @description
 * this method is responsible for sending response back to the client
 * @param {object} res the response object
 * @param {number} statusCode the http status code
 * @param {string} message the response message
 * @param {object} data the data to be sent back to the client
 * @param {object} error the error object, when exists
 * @returns the response to be sent back to the client
 */
export const sendResponse = (
  response,
  statusCode,
  message,
  data = [],
  error = {}
) => {
  response.status(statusCode).json({
    statusCode,
    message,
    data,
    error,
  });
};
