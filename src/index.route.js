import express from 'express';
import collegeRoute from './api/college/college.route.js';
import userRoute from './api/user/user.route.js';
import generalRoute from './api/general/general.route.js';

const router = express.Router();

router.use('/user', userRoute);
router.use('/colleges', collegeRoute);
router.use('/app', generalRoute);

export default router;