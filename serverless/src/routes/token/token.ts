import express from 'express';
import { getToken, refreshToken } from '../../controllers/token';
const router = express.Router();

router.get('/refresh', refreshToken);

router.get('', getToken);

export default router;
