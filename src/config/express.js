import express from 'express';

import routes from '../index.route.js';
import authenticateAccessToken from '../middleware/token_auth.middleware.js';

const app = express();

if (process.env.NODE_ENV !== 'production') {
    app.use(authenticateAccessToken);
}

app.use('/api', routes);

export default app;