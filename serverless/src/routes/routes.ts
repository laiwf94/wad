import express from 'express';
import movieRouter from './movie/movieRoute';
import tokenRoute from './token/tokenRoute';
import { handleError } from '../middlewares/error';

const router = express.Router();

router.use(movieRouter);
router.use(tokenRoute);
router.use(handleError);

export default router;
