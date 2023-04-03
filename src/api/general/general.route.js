import express from 'express';
import { getLanguages } from './general.controller.js';

const router = express.Router();

router.get('/getLanguages', getLanguages);

export default router;