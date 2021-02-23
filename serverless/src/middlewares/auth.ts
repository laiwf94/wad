import { NextFunction, Request, Response } from 'express';
import { readToken } from '../util/token';
import { MovieError } from './error';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
	const { token } = req.query;
	const storedToken = readToken();
  
	if (!token || storedToken !== token) {
		next(new MovieError('Unauthorized Request', 401, req.originalUrl));
	}
  next();
};
