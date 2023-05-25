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
      } else {
        errorMsg = error.message || 'Internal Server Error';
        statusCode = error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }

      return next(new AppError(
        errorMsg,
        statusCode,
        error.response || error
      ));
    }
  }

  /**
   * @description
   * the controller method to fetch all media from S3 bucket
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   * @returns the media available in the S3 bucket
   */
  static async fetchAllMedia(_, res, next) {
    try {
      const fetchAllMediaResult = await S3.listObjectsV2({
        Bucket: process.env.AWS_S3_BUCKET_NAME
      }).promise();

      const { Contents: mediaContents, Name: bucketName } = fetchAllMediaResult;
      const media = mediaContents.map((item) => item.Key);

      return sendResponse(res, HTTP_STATUS_CODES.OK, 'All media fetched successfully', { bucketName, media });
    } catch (error) {
      return next(new AppError(
        error.message || 'Internal Server Error',
        error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
        error.response || error
      ));
    }
  }

  /**
   * @description
   * the controller method to delete a media from S3 bucket
   * @param {object} req the request object
   * @param {object} res the response object
   * @param {object} next the next middleware function in the application’s request-response cycle
   */
  static async deleteMedia(req, res, next) {
    try {
      const { file } = req.query;
      await S3.deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: file,
      }).promise();

      return sendResponse(res, HTTP_STATUS_CODES.OK, 'Media deleted successfully');
    } catch (error) {
      let errorMsg = '';
      let statusCode;

      if (error.code === 'MissingRequiredParameter') { // on not providing the name of the file to be deleted
        errorMsg = error.message || 'Internal Server Error';
        statusCode = error.statusCode || HTTP_STATUS_CODES.BAD_REQUEST;
      } else {
        errorMsg = error.message || 'Internal Server Error';
        statusCode = error.statusCode || HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR;
      }

      return next(new AppError(
        errorMsg,
        statusCode,
        error.response || error
      ));
    }
  }
}
