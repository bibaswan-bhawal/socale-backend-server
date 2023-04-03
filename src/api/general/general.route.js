import express from 'express';
import { getLanguages } from './general.controller';

const router = express.Router();

router.get('/app/getLanguages', getLanguages);

export default router;