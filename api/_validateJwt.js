import OktaJwtVerifier from '@okta/jwt-verifier';
import { JwtVerifier, OktaClient } from './_common';

const ORG_URL = process.env.REACT_APP_OKTA_URL;
const AUTH_SERVER_ID = process.env.REACT_APP_AUTH_SERVER_ID;
const ISSUER = `${ORG_URL}/oauth2/${AUTH_SERVER_ID}`;

/**
 *
 * @param {Object} options An options object containing any of the following: idToken, accessToken, an `aud` value, and any custom claims to assert (in an `assertClaims` object).
 * @param {Object} [req] The original `req` object. Used to perform additional validation.
 * @param {Object} [client] An instance of OktaClient. Used to validate parent/child relationship (if necessary).
 * @returns {Object} The results of the validation as well as the accessToken validated.
 */
const validateJwt = async (
	{
		idToken,
		accessToken,
		aud = 'salesf00rce',
		assertClaims = { 'scp.includes': ['user:read:self'] },
	},
	req,
	client = new OktaClient()
) => {
	let _accessTokenString = accessToken;
	let _idTokenString = idToken;
	let _accessToken;
	let _idToken;

	try {
		const {
			query: { id },
			headers: { authorization },
		} = req || {};

		// 1) If there is an idToken, validate it.
		if (_idTokenString) {
			// Spin up a validator
			const customJwtVerifier = new JwtVerifier();

			_idToken = await customJwtVerifier.verifyIdToken(_idTokenString);
		}

		// 2) If there is not an accessToken extract from `req`.
		if (!_accessTokenString && authorization) {
			const regex = /Bearer (.+)/;
			const match = regex.exec(authorization);

			_accessTokenString = match?.length === 2 ? match[1] : undefined;
		}

		if (!_accessTokenString && !_idTokenString) {
			throw new Error('No JWT found!');
		}

		// 3) If there is an accessToken, validate it
		if (_accessTokenString) {
			// i) Spin up our jwtVerifier
			const jwtVerifier = new OktaJwtVerifier({ issuer: ISSUER, assertClaims });

			// ii) Do the initial JWT validation
			_accessToken = await jwtVerifier.verifyAccessToken(_accessTokenString, aud);

			const {
				claims: { scp, sub, uid },
			} = _accessToken;

			// iii) JWT is valid, but does the user have permission to act on the resource?
			if (!scp.includes('user:link') && ![sub, uid].includes(id)) {
				// the resource id does not equal either the parent account nor the logged in user
				// we need to determine if the resource is associated to the parent account
				const associatedAccounts = await client.getAssociatedAccounts(sub);

				if (!associatedAccounts.includes(id)) {
					// the resource is not related to the parent account ==> 401
					throw new Error('Accounts not associated!');
				}
			}
		}

		return { isValid: true, accessToken: _accessToken, idToken: _idToken };
	} catch (error) {
		return { isValid: false, error };
	}
};

export default validateJwt;
