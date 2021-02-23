import express, { NextFunction, Response } from 'express';
import { exportMovies, getMovies } from '../controllers/movie';
import { checkAuth } from '../middlewares/auth';
import { MovieRequest } from '../models/movie';


const router = express.Router();

router.get('/movies', checkAuth, getMovies);

router.get('/exportmovies', checkAuth, exportMovies);

router.use((req: MovieRequest, res: Response, next: NextFunction) => {
	if (req.movie || req.movies) {
		return res.json(req.movie || req.movies);
	}
	next();
});

export default router;
