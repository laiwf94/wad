import axios, { AxiosResponse } from 'axios';
import { NextFunction, Request, Response } from 'express';
import { appendFileSync, unlinkSync } from 'fs';
import { isArray, isNil, isNumber, toNumber } from 'lodash';
import { MovieError } from '../middlewares/error';
import { Movie, MovieRequest } from '../models/movie';
import logger from '../util/logger';
import { initRedis } from '../util/redis';

const { PWD, QUEUE_DELAY, RETRY_TIMES, USE_REDIS, API_BASE_URL, API_CINEMAWORLD_MOVIES_PATH, API_TOKEN, API_FILMWORLD_MOVIES_PATH, QUEUE_SIZE } = process.env;
const assetPath = `${PWD}/asset`;

export const getMovies = async (req: MovieRequest, res: Response, next: NextFunction) => {
	const { page, size, sort, order }: any = req.query;
	const promises = [getMovieFromCinemaWorldAPI(req.query), getMovieFromFilmWorldAPI(req.query)];
	let movies: Movie[] = [];
	Promise.all(promises)
		.then((results: AxiosResponse[]) => {
			for (let i = 0; i < results.length; i++) {
				if (results[i].data && isArray(results[i].data)) {
					movies.push(...results[i].data);
				}
			}
			movies = sortMovie(sort, order, movies);
			movies = pagination(page, size, movies);
			req.movies = movies;
			next();
		})
		.catch((err) => {
			logger.error(err.message);
			next(new MovieError('Failed to get movies from providers', 500, req.originalUrl));
		});
};

const getMovieFromCinemaWorldAPI = ({ page, size, sort, order }: any) => {
	return axios
		.get(`${API_BASE_URL}${API_CINEMAWORLD_MOVIES_PATH}`, {
			params: {
				token: API_TOKEN,
				page,
				size,
				sort,
				order,
			},
		})
		.catch((err) => err.response);
};

const getMovieFromFilmWorldAPI = ({ page, size, sort, order }: any) => {
	return axios
		.get(`${API_BASE_URL}${API_FILMWORLD_MOVIES_PATH}`, {
			params: {
				token: API_TOKEN,
				page,
				size,
				sort,
				order,
			},
		})
		.catch((err) => err.response);
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

const exportMovie = (promises: Promise<any>[]) => {
	let movies: Movie[] = [];
	return Promise.all(promises)
		.then((results: AxiosResponse[]) => {
			for (let i = 0; i < results.length; i++) {
				if (results[i]?.data && isArray(results[i]?.data)) {
					movies.push(...results[i].data);
				}
			}
			return movies;
		})
		.catch((err) => {
			logger.error(err.message);
		});
};

const retryAsync = async (promise: Promise<any>[], times = 0) => {
	let movies: any = [];
	try {
		const movie: any = await exportMovie(promise);
		if (!movie || movie.length === 0) {
			throw new MovieError('Retry call', 500, '');
		}
		movies.push(...movie);
	} catch (err) {
		if (times < (toNumber(RETRY_TIMES) || 3)) {
			// delay
			setTimeout(async () => {
				movies.push(...(await retryAsync(promise, times + 1)));
			}, toNumber(QUEUE_DELAY) || 100);
		}
	}
	return movies;
};

export const exportMovies = async (req: Request, res: Response) => {
	const filename = `movie-${new Date().getTime()}.csv`;
	const fullPath = `${assetPath}/${filename}`;

	const page = 10;
	const size = toNumber(QUEUE_SIZE || 5);
	const params = { page, size, filename, fullPath, res };
	if (USE_REDIS === 'true') {
		return handleByRedisQueue(params);
	}
	handleByCustomQueue(params);
};

const handleByRedisQueue = async ({ page, size, filename, fullPath, res }: any) => {
	const { finished, process, add } = await initRedis();

	const movies: any = [];
	const uid = new Date().getTime();
	for (let i = 1; i <= page; i++) {
		add({ page: i, size, target: 'filmworld' }, 'filmworld-' + i + uid);
		add({ page: i, size, target: 'cinemaworld' }, 'cinemaworld-' + i + uid);
	}

	process(async (data: any) => {
		const { page, size, target } = data;
		const promises = target === 'cinemaworld' ? [getMovieFromCinemaWorldAPI({ page, size })] : [getMovieFromFilmWorldAPI({ page, size })];
		const downloadMovies: any = await exportMovie(promises);
		if (downloadMovies && isArray(downloadMovies) && downloadMovies.length > 0) {
			movies.push(...downloadMovies);
		} else {
			throw new MovieError('fail to download ' + target + ' at page ' + page, 500, '');
		}
	});

	finished(() => {
		sendResponse({ movies, fullPath, filename, res });
	});
};

const sendResponse = ({ movies, fullPath, filename, res }: any) => {
	for (const movie of movies) {
		appendFileSync(fullPath, `"${movie.id}", "${movie.title}", "${movie.overview}", "${movie.poster}", "$${movie.price}" \n`);
	}

	res.download(fullPath, filename, () => {
		try {
			unlinkSync(fullPath);
		} catch (err) {
			logger.error(`failed to delete file`);
		}
	});
};

const handleByCustomQueue = async ({ page, size, filename, fullPath, res }: any) => {
	const queues: any = {};
	for (let i = 1; i <= page; i++) {
		const cinemaworld = [getMovieFromCinemaWorldAPI({ page: i, size })];
		const filmworld = [getMovieFromFilmWorldAPI({ page: i, size })];
		// safe order
		queues[i] = [];
		queues[i].push(...(await retryAsync(cinemaworld)));
		queues[i].push(...(await retryAsync(filmworld)));
	}

	for (let i = 1; i <= page; i++) {
		for (const movie of queues[i]) {
			appendFileSync(fullPath, `"${movie.id}", "${movie.title}", "${movie.overview}", "${movie.poster}", "$${movie.price}" \n`);
		}
	}

	res.download(fullPath, filename, () => {
		try {
			unlinkSync(fullPath);
		} catch (err) {
			logger.error(`failed to delete file`);
		}
	});
};
