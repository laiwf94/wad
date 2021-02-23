import { config } from 'dotenv';
config();
import app from './src/app';
import { tokenExists, writeToken } from './src/util/token';
import serverless from 'serverless-http';
import logger from './src/util/logger';

if (process.env.ENV === 'local') {
	const port = process.env.PORT || 8090;

	app.listen(port, () => {
		logger.info(`server started at http://localhost:${port}`);
	});
	// write token at application start
	if (!tokenExists()) {
		writeToken();
	}
}


// for serverless
export const handler = serverless(app);
