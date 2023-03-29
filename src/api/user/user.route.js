import express from 'express';
import {
    addUserToCollege,
    sendCollegeVerificationEmail,
    generateProfile,
    createNewUser
} from './user.controller.js';

const router = express.Router();

router.post('/send_college_verify_email', sendCollegeVerificationEmail);
router.post('/:userId/addToCollege/:collegeId', addUserToCollege);
router.get('/generateProfile', generateProfile);
router.post('/onboard', createNewUser);

export default router;