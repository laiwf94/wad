import express, { NextFunction, Response } from 'express';
import { TokenRequest } from '../../models/token';
import oidc from '../..//util/oidc';
import token from './token';

const router = express.Router();

// only able to access token endpoint when okta enabled
if (process.env.ENABLE_OKTA === 'true') {
	router.use('/token', oidc.ensureAuthenticated(), token);
}

router.use((req: TokenRequest, res: Response, next: NextFunction) => {
	if (req.token) {
		return res.json({
			token: req.token,
		});
	}
	next();
});

export default router;
