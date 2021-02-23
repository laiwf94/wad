import { NextFunction, Response } from 'express';
import { MovieError } from '../middlewares/error';
import { TokenRequest } from '../models/token';
import { readToken, writeToken } from '../util/token';

export const refreshToken = (req: TokenRequest, res: Response, next: NextFunction) => {
	writeToken();
  const token = readToken();
  if(!token){
    next(new MovieError('Token has failed to generate', 500, req.originalUrl));
  }
  req.token = token;
	next();
};

export const getToken = (req: TokenRequest, res: Response, next: NextFunction) => {
  const token = readToken();
  if(!token){
    next(new MovieError('Token not found', 404, req.originalUrl));
  }
  req.token = token;
  next();
 }