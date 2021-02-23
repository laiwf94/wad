import { NextFunction, Request, Response } from 'express';
import { MovieError } from './error';

export const knockdown = (req: Request, res: Response, next: NextFunction) => {
	const rnd = Math.floor(Math.random() * 4);

	if (req.originalUrl.startsWith('/api') && process.env.FLAKY_API === 'true') {
		const path = req.originalUrl.substr(4);
		// knockout none at 0
		// knockout cinemaworld at 1
		// knockout filmworld at 2
		// knockout both at 3

		if ((rnd === 1 && path.startsWith('/cinemaworld')) || (rnd === 2 && path.startsWith('/filmworld')) || rnd === 3) {
			return next(new MovieError('service unavailable', 500, req.originalUrl));
		}
	}
	next();
};
