import { NextFunction, Request, Response } from 'express';
import { MovieError } from './error';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.query;
  
	if (!token || process.env.SECRET_TOKEN !== token) {
		next(new MovieError('Unauthorized Request', 401, req.originalUrl));
	}
  next();
};
