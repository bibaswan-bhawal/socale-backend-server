import express from 'express';
import { getCollegeDataByEmail, getMinors, getMajors } from './college.controller.js';

const router = express.Router();

/**
 * @api {get} /api/college/byEmail
 */
router.get('/college/byEmail', getCollegeDataByEmail);

router.get('/:collegeId/minors', getMinors);

router.get('/:collegeId/majors', getMajors);

export default router;