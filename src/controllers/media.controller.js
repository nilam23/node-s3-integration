import { S3 } from '../configs/s3.configs.js';
import { HTTP_STATUS_CODES } from '../helpers/constants.js';
import { AppError } from '../helpers/error.js';
import { sendResponse } from '../helpers/utils.js';

export class MediaController {
  /**
   * @description
   * the controller method to upload a media into S3 bucket
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns few details of the media uploaded
   */
  static async uploadMedia(req, res) {
    const { originalname: fileName, size: fileSize } = req.file;

    return sendResponse(res, HTTP_STATUS_CODES.OK, 'Media uploaded successfully', { fileName, fileSize });
  }

  /**
   * @description
   * the controller method to fetch a media from S3 bucket
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the media body in binary
   */
  static async fetchMedia(req, res, next) {
    try {
      const { file } = req.query;

      const fetchMediaResult = await S3.getObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file,
      }).promise();

      return sendResponse(res, HTTP_STATUS_CODES.OK, 'Media fetched successfully', fetchMediaResult.Body);
    } catch (error) {
      let errorMsg = '';
      let statusCode;

      if (error.code === 'MissingRequiredParameter') { // on not providing the name of the file to be fetched
        errorMsg = error.message || 'Internal Server Error';
        statusCode = error.statusCode || HTTP_STATUS_CODES.BAD_REQUEST;
      } else if (error.code === 'NoSuchKey') { // on providing a file that does not exist in the bucket
        errorMsg = error.message || 'Internal Server Error';
        statusCode = error.statusCode || HTTP_STATUS_CODES.BAD_REQUEST;
      }

      return next(new AppError(
        errorMsg,
        statusCode,
        error.response || error
      ));
    }
  }
}