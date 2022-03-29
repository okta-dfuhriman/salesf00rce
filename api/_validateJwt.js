import OktaJwtVerifier from '@okta/jwt-verifier';

const ORG_URL = process.env.REACT_APP_OKTA_URL;
const AUTH_SERVER_ID = process.env.REACT_APP_OKTA_AUTH_SERVER_ID;
const ISSUER = `${ORG_URL}/oauth2/${AUTH_SERVER_ID}`;

/**
 *
 * @param {string} jwt The JWT to be validated.
 * @param {string} aud The `aud` value to be validated.
 * @param {Object} config A configuration for the verifier to use. See [Okta documentation](https://github.com/okta/okta-jwt-verifier-js).
 * @returns
 */
const validateJwt = async (jwt, aud, config = {}) => {
	try {
		// Spin up our jwtVerifier
		const jwtVerifier = new OktaJwtVerifier({ issuer: ISSUER, ...config });

		return await jwtVerifier.verifyAccessToken(jwt, aud);
	} catch (error) {
		throw new Error(error);
	}
};

export default validateJwt;
