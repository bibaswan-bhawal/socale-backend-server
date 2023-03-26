import express from 'express';

import routes from '../index.route.js';
import authenticateAccessToken from '../middleware/token_auth.middleware.js';
import APIError from '../errors/api.error.js';

const app = express();

if (process.env.NODE_ENV === 'production') {
    app.use(authenticateAccessToken);
}

app.use('/api', routes);

app.use((_, __, next) => {
    const err = APIError.notFound('API not found');
    return next(err);
});

// error handler, send stacktrace only during development
app.use((err, _, res, __) => // eslint-disable-line no-unused-vars
    res.status(err.status).json({
        message: err.isPublic ? err.message : httpStatus[err.status],
        stack: process.env.NODE_ENV === 'development' ? err.stack : {}
    })
);

export default app;