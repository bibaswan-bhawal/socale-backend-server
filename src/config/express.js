import express from 'express';
import dotenv from 'dotenv';


import routes from '../index.route.js';
import authenticateAccessToken from '../middleware/token_auth.middleware.js';
import APIError from '../errors/api.error.js';

dotenv.config();

const app = express();

app.get('/health', (_, res) => res.sendStatus(200)); // ecs health check

if (process.env.NODE_ENV == 'production') {
    app.use('/api', authenticateAccessToken, routes);
} else {
    app.use('/api', routes);
}


app.use((_, __, next) => {
    const err = APIError.notFound('API not found');
    return next(err);
});

app.use((err, req, res, __) => {
    console.log(req.originalUrl);

    res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
});

export default app;