import express from 'express';
import { addUserToCollege, sendCollegeVerificationEmail } from './user.controller.js';

const router = express.Router();

router.get('/send_college_verify_email', sendCollegeVerificationEmail);
router.post('/:userId/add_to_college/:collegeId', addUserToCollege);

export default router;