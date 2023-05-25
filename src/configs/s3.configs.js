/* eslint-disable import/no-extraneous-dependencies */
import AWS from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';

/**
 * creating the S3 service object and configuring it for media storage via multer
 */

AWS.config.update({
  region: process.env.AWS_REGION,
});

export const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

export const upload = multer({
  storage: multerS3({
    bucket: process.env.AWS_S3_BUCKET_NAME,
    s3: S3,
    acl: 'public-read',
    key: (_, file, cb) => {
      cb(null, file.originalname);
    },
  }),
});
