import express from 'express';
import { createCinemaworldMovie, getCinemaWorldMovie, getCinemaWorldMovies } from '../../controllers/movie';
const router = express.Router();

router.get('/movies', getCinemaWorldMovies);

router.get('/movie/:id', getCinemaWorldMovie);

router.post('/movie', createCinemaworldMovie);


export default router;
