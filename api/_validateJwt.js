import OktaJwtVerifier from '@okta/jwt-verifier';

const AUD = process.env.AUD;
const ORG_URL = process.env.REACT_APP_OKTA_URL;
const AUTH_SERVER_ID = process.env.REACT_APP_OKTA_AUTH_SERVER_ID;
const ISSUER = `${ORG_URL}/oauth2/${AUTH_SERVER_ID}`;

/**
 *
 * @param {Object} options An options object containing the `jwt` to be validated, a `aud` value, and any custom claims to assert.
 * @param {Object} [headers] The headers from the original `req`.
 * @returns {Object} The results of the validation as well as the accessToken validated.
 */
const validateJwt = async ({ jwt, aud = AUD, assertClaims }, headers) => {
	let _jwt = jwt;

	try {
		// 1) Determine if a JWT was provided or if it needs to be extracted.
		if (headers && !jwt) {
			const { authorization } = headers;
			const regex = /Bearer (.+)/;
			const match = regex.exec(authorization);

			_jwt = match?.length === 2 ? match[1] : undefined;
		}

		if (!_jwt) {
			throw new Error('No JWT found!');
		}

		// 2) Spin up our jwtVerifier
		const jwtVerifier = new OktaJwtVerifier({ issuer: ISSUER, assertClaims });

		// 3) Validate the JWT
		const accessToken = await jwtVerifier.verifyAccessToken(_jwt, aud);

		return { isValid: true, accessToken };
	} catch (error) {
		return { isValid: false, error };
	}
};

export default validateJwt;
