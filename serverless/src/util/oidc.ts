import oidcMiddleware from '@okta/oidc-middleware';

const oktaSettings = {
	clientId: process.env.OKTA_CLIENTID,
	clientSecret: process.env.OKTA_CLIENTSECRET,
	url: process.env.OKTA_URL_BASE,
	appBaseUrl: process.env.OKTA_APP_BASE_URL,
};

let oidc: any = null;

if (process.env.ENABLE_OKTA === 'true') {
	oidc = new oidcMiddleware.ExpressOIDC({
		issuer: oktaSettings.url + '/oauth2/default',
		client_id: oktaSettings.clientId,
		client_secret: oktaSettings.clientSecret,
		appBaseUrl: oktaSettings.appBaseUrl,
		scope: 'openid profile',
		routes: {
			login: {
				path: '/login',
			},
			loginCallback: {
				path: '/callback',
				afterCallback: '/api/token',
				failureRedirect: '/404.htm',
			},
		},
	});
}

export default oidc;
