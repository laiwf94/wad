import { json, urlencoded } from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import session from 'express-session';
import oidc from './util/oidc';
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

// parsing body to json or urlencoded
app.use(json());
app.use(urlencoded({ extended: true }));

// minimum production security
app.use(helmet());

// only use express-session when okta enabled
if (process.env.ENABLE_OKTA === 'true') {
	app.use(
		session({
			secret: 'ladhnsfolnjaerovklnoisag093q4jgpijbfimdposjg5904mbgomcpasjdg"pomp;m',
			resave: true,
			saveUninitialized: false,
		}),
	);

	app.use(oidc.router);
}

//invoke all api endpoint
app.use('/api', router);

export default app;
