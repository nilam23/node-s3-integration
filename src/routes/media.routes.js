import { upload } from '../configs/s3.configs.js';
import { MediaController } from '../controllers/media.controller.js';

/**
 * @description
 * the routes associated with media
 * @param {object} app the express application instance
 */
export const mediaRoutes = (app) => {
  app
    .route('/media')
    .get(MediaController.fetchMedia)
    .post(upload.single('file'), MediaController.uploadMedia)
    .delete(MediaController.deleteMedia);
};
