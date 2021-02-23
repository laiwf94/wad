import express from 'express';
import { createFilmworldMovie, getFilmWorldMovie, getFilmWorldMovies } from '../../controllers/movie';
const router = express.Router();

router.get('/movies', getFilmWorldMovies);

router.get('/movie/:id', getFilmWorldMovie);

router.post('/movie', createFilmworldMovie);

export default router;
