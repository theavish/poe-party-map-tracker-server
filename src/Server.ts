import cookieParser from 'cookie-parser';
import express, { NextFunction } from 'express';
import logger from 'morgan';
import path from 'path';
import BaseRouter from './routes';

// Init express
const app = express();

// Add middleware/settings/routes to express.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Point express to the 'views' directory. If you're using a
 * single-page-application framework like react or angular
 * which has its own development server, you might want to
 * configure this to only serve the index file while in
 * production mode.
 */
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);
const staticDir = path.join(__dirname, 'assets');
app.use(express.static(staticDir));

const errorHandler = (
    error: Error,
    request: express.Request,
    response: express.Response,
    next: NextFunction,
) => {
    console.error(error.stack);

    const options = {
        root: viewsDir,
    };

    response
        .status(500)
        .sendFile('./500.html', options);
};

/**
 * Routing
 */
app.use('/', BaseRouter);
app.use(errorHandler);

export default app;
