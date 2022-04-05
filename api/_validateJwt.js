import OktaJwtVerifier from '@okta/jwt-verifier';
import { equal } from 'assert';

const ORG_URL = process.env.REACT_APP_OKTA_URL;
const AUTH_SERVER_ID = process.env.REACT_APP_AUTH_SERVER_ID;
const ISSUER = `${ORG_URL}/oauth2/${AUTH_SERVER_ID}`;

/**
 *
 * @param {Object} options An options object containing the `jwt` to be validated, a `aud` value, and any custom claims to assert.
 * @param {Object} [req] The original `req` object. Used to perform additional validation.
 * @returns {Object} The results of the validation as well as the accessToken validated.
 */
const validateJwt = async ({ jwt, aud = 'salesf00rce', assertClaims }, req) => {
	let _jwt = jwt;

	try {
		const {
			query: { id },
			headers: { authorization },
		} = req || {};

		// 1) Determine if a JWT was provided or if it needs to be extracted.
		if (authorization && !jwt) {
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

		const {
			claims: { scp, uid },
		} = accessToken;

		// 4) Do resource Id permission check for normal getUser.
		// if (
		// 	!scp?.includes('user:link') &&
		// 	(scp?.includes('user:read:self') || scp?.includes('user:update:self'))
		// ) {
		// 	equal(
		// 		id,
		// 		uid,
		// 		'When `self` scope is included, the resource must be the subject of the access token.'
		// 	);
		// }

		return { isValid: true, accessToken };
	} catch (error) {
		return { isValid: false, error };
	}
};

export default validateJwt;
