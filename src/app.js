import express from 'express';
import {} from 'dotenv/config.js';
import bodyParser from 'body-parser';
import { AppError, handleError } from './helpers/error.js';
import { HTTP_STATUS_CODES } from './helpers/constants.js';
import { mediaRoutes } from './routes/media.routes.js';

// the express application instance
const app = express();

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// routing
mediaRoutes(app);
app.all('*', (req, _, next) => next(new AppError(`Can't find ${req.method} ${req.originalUrl} on this url`, HTTP_STATUS_CODES.NOT_FOUND)));

// centralized error handling
app.use((error, req, res, _) => handleError(error, req, res, _));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
