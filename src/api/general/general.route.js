import express from 'express';
import { getLanguages, getIntersts } from './general.controller.js';

const router = express.Router();

router.get('/getLanguages', getLanguages);
router.get('/getInterests', getIntersts);

export default router;