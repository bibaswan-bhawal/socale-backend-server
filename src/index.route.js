import express from 'express';
import collegeRoute from './api/college/college.route.js';
import userRoute from './api/user/user.route.js';

const router = express.Router();

router.get('/health', (_, res) => res.sendStatus(200)); // ecs health check

router.use('/college', collegeRoute);
router.use('/user', userRoute);

export default router;