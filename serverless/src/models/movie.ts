import { Request } from 'express';

export interface Movie {
	id: string;
	title: string;
	poster: string;
	overview: string;
	release_date?: number;
	genres?: string[];
	price: number;
}

export interface MovieRequest extends Request {
	movies: Movie[];
	movie: Movie;
}
