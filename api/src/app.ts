import { json, urlencoded } from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import router from './routes/routes';
import helmet from 'helmet';

const app = express();

//cors
app.use((req: Request, res: Response, next: NextFunction) => {
	res.set({
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
		'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
	});
	next();
});

app.use(json());
app.use(urlencoded({ extended: true }));

// minimum production security
app.use(helmet());

app.use('/api', router);

export default app;
