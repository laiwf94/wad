import { Buffer } from 'buffer';
import { readFileSync, writeFileSync } from 'fs';
import { MovieError } from '../middlewares/error';
import { v4 } from 'uuid';
import logger from './logger';

const tokenPath = `${process.env.PWD}/datastore/token.json`;

export const generateToken = () => {
	const buff = Buffer.from(v4());
	return buff.toString('base64');
};

export const writeToken = () => {
	try {
		writeFileSync(tokenPath, JSON.stringify({ token: generateToken() }));
	} catch (err) {
    logger.error('faled to write token');
		throw new MovieError('failed to read token', 500, '');
	}
};

export const readToken = () => {
	try {
		const tokenRaw = readFileSync(tokenPath, 'utf8');
		const { token } = JSON.parse(tokenRaw);
		return token;
	} catch (err) {
    logger.error('faled to read token');
	}
	return null;
};

export const tokenExists = () => {
	return !!readToken();
};
