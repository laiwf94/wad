import express from 'express';
import movieRouter from './movie';
import { handleError } from '../middlewares/error';


const router = express.Router();

router.use(movieRouter);
router.use(handleError);

export default router;
