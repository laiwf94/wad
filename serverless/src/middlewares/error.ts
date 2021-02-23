import { NextFunction, Request, Response } from 'express';

export class MovieError extends Error {
	status: number;
	endpoint: string;

	constructor(message: string, status: number, endpoint: string) {
		super(message);
		this.status = status;
		this.endpoint = endpoint;
	}
}

export const handleError = (err: any, req: Request, res: Response, next: NextFunction) => {
	const status = err.status || 500;

	const sanitisedError = removeSecurityInfo(err);

	res.status(status).json({
		message: sanitisedError.message,
		endpoint: sanitisedError.endpoint,
	});
	next();
};

const removeSecurityInfo = (err: any) => {
	switch (err.status) {
		case 400:
			return { message: 'Bad request' };
		case 401:
			return { message: 'Unauthorized' };
		case 403:
			return { message: 'Forbidden' };
		default:
			return err;
	}
};
