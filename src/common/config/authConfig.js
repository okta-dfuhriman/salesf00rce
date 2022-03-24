/** @format */

const OKTA_TESTING_DISABLEHTTPSCHECK = process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
const REDIRECT_URI = `${window.location.origin}/login/callback`;
const SCOPES = process.env.REACT_APP_OKTA_SCOPES;
const CLIENT_ID = process.env.REACT_APP_OKTA_CLIENT_ID;
const AUTH_SERVER_ID = process.env.REACT_APP_OKTA_AUTH_SERVER_ID;
const OKTA_URL = process.env.REACT_APP_OKTA_URL;
const ISSUER = `${OKTA_URL}/oauth2/${AUTH_SERVER_ID}`;

// eslint-disable-next-line
const authConfig = {
	oidc: {
		clientId: CLIENT_ID,
		issuer: ISSUER,
		redirectUri: REDIRECT_URI,
		scopes: SCOPES.split(' '),
		pkce: true,
		tokenManager: {
			autoRenew: true,
		},
		disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
	},
};

export default authConfig;
