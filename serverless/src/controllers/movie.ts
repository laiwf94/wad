import { NextFunction, Request, Response } from 'express';
import { readFileSync, writeFileSync } from 'fs';
import { isNil, isNumber, isString, toNumber } from 'lodash';
import { MovieError } from '../middlewares/error';
import { Movie, MovieRequest } from '../models/movie';
import logger from '../util/logger';

const cinemaworldPath = `${process.env.PWD}/datastore/cinemaworld.json`;
const filmworldPath = `${process.env.PWD}/datastore/filmworld.json`;

export const getCinemaWorldMovies = (req: MovieRequest, res: Response, next: NextFunction) => {
	const { page, size, sort, order }: any = req.query;
	let cinemaworld = readMovie(cinemaworldPath);
	cinemaworld = sortMovie(sort, order, cinemaworld);
	cinemaworld = pagination(page, size, cinemaworld);
	req.movies = [...cinemaworld];
	next();
};

export const getFilmWorldMovies = (req: MovieRequest, res: Response, next: NextFunction) => {
	const { page, size, sort, order }: any = req.query;
	let filmworld = readMovie(filmworldPath);
	filmworld = sortMovie(sort, order, filmworld);
	filmworld = pagination(page, size, filmworld);
	req.movies = [...filmworld];
	next();
};

export const getCinemaWorldMovie = (req: MovieRequest, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const cinemaworld = readMovie(cinemaworldPath);
	const movie = cinemaworld.find((m: Movie) => m.id === id);
	if (!movie) {
		return next(new MovieError('movie not found', 404, req.originalUrl));
	}
	req.movie = { ...movie };
	next();
};

export const getFilmWorldMovie = (req: MovieRequest, res: Response, next: NextFunction) => {
	const id = req.params.id;
	const filmworld = readMovie(filmworldPath);
	const movie = filmworld.find((m: Movie) => m.id === id);
	if (!movie) {
		return next(new MovieError('movie not found', 404, req.originalUrl));
	}
	req.movie = { ...movie };
	next();
};

export const createFilmworldMovie = (req: MovieRequest, res: Response, next: NextFunction) => {
	try {
		validate(req);
		const filmworld = readMovie(filmworldPath);
		req.movie = createMovie(filmworld, req.body);
		res.statusCode = 201;
		res.statusMessage = 'successfully created';
	} catch (err) {
		err.endpoint = req.originalUrl;
		return next(err);
	}
	next();
};

export const createCinemaworldMovie = (req: MovieRequest, res: Response, next: NextFunction) => {
	try {
		validate(req);
		const cinemaworld = readMovie(cinemaworldPath);
		req.movie = createMovie(cinemaworld, req.body);
		res.statusCode = 201;
		res.statusMessage = 'successfully created';
	} catch (err) {
		err.endpoint = req.originalUrl;
		return next(err);
	}
	next();
};

const writeMovie = (movies: Movie[], path: string) => {
	try {
		writeFileSync(path, JSON.stringify(movies));
	} catch (err) {
		logger.error('faled to write movie');
		throw new MovieError(err, 500, '');
	}
};

const readMovie = (path: string): Movie[] => {
	try {
		const moviesRaw = readFileSync(path, 'utf8');
		const movies = JSON.parse(moviesRaw);
		return movies;
	} catch (err) {
		logger.error('faled to write movie');
		throw new MovieError(err, 500, '');
	}
};

const createMovie = (arr: Movie[], { title, poster, overview, price }: Movie) => {
	const movie = {
		id: arr.length + 1 + '',
		title,
		poster,
		overview,
		price: toNumber(price),
	};
	const newCinemaWrold = [...arr, movie];
	writeMovie(newCinemaWrold, cinemaworldPath);
	return movie;
};

const sortMovie = (s: string, o: string = 'asc', arr: Movie[]) => {
	if (['price', 'title', 'overview', 'poster'].includes(s)) {
		if (!['asc', 'dsc'].includes(o)) o = 'asc';
		
		return arr.sort((m1: any, m2: any) => {
			if (isNil(m1[s]) || isNil(m2[s])) {
				return 0;
			}
			if (isNumber(m1[s]) && isNumber(m2[s])) {
				return o === 'asc' ? m1[s] - m2[s] : m2[s] - m1[s];
			}
			return o === 'asc' ? m1[s].localeCompare(m2[s]) : m2[s].localeCompare(m1[s]);
		});
	}
	return arr;
};

const pagination = (page: string, size: string, arr: Movie[]) => {
	const p = toNumber(page) - 1;
	const s = toNumber(size);
	
	if (page && size && isNumber(p) && isNumber(s)) {
		if (p < 0 || s <= 0) throw new MovieError('Invalid page number or size number', 500, '');
		return arr.splice(p * s, s);
	}
	return arr;
};

const validate = (req: Request) => {
	const { title, poster, overview, price } = req.body;
	if (!title || !poster || !overview || !price) {
		throw new MovieError('essential data missing', 400, req.originalUrl);
	}
	if (!isString(title) || !isString(poster) || !isString(overview) || !isNumber(price)) {
		throw new MovieError('incorrect data type', 400, req.originalUrl);
	}
};
