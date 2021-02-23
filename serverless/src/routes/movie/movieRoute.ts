import express, { NextFunction, Response } from 'express';
import cinemaworldMovie from '../movie/cinemaworld';
import filmworldMovie from '../movie/filmworld';
import { knockdown } from '../../middlewares/knockdown';
import { MovieRequest } from '../../models/movie';
import { checkAuth } from '../../middlewares/auth';

const router = express.Router();

router.use('/cinemaworld', knockdown, checkAuth, cinemaworldMovie);

router.use('/filmworld', knockdown, checkAuth, filmworldMovie);

router.use((req: MovieRequest, res: Response, next: NextFunction) => {
	if (req.movie || req.movies) {
		return res.json(req.movie || req.movies);
	}
	next();
});

export default router;
