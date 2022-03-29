import { ApiError } from './_error';
import validateJwt from './_validateJwt';

const AUD = process.env.AUD;
const LINK_SCOPES = process.env.LINK_SCOPES;

/**
 *
 * @param {Object} req A `VercelRequest`, which is a wrapper around a Node Request.
 * @param {string} [aud] The `aud` value from the JWT to be validated against. Comes from config if not provided.
 * @returns {Object} The results of the validation as well as the JWT claims.
 */
const doAuthN = async (req, aud = AUD) => {
	try {
		const {
			/* 'authorization' === currently logged in (primary) user's JWT */
			headers: { authorization },
			/* 'linkWith' === JWT for account being linked to the primary profile. */
			body: { linkWith },
		} = req;

		try {
			/*
			 * 	1) validate 'linkWith' JWT => should have 'user:link' scope
			 *
			 *  Will throw error if doesn't pass
			 */
			// TODO => handle use case where profile is already linked to another profile and JWT has 'primary_profile' claim already!
			const linkWithJwt = await validateJwt(linkWith, aud, {
				assertClaims: { 'scp.includes': LINK_SCOPES.split(' ') },
			});

			// 2) validate 'authorization' JWT => should pass basic validation
			const regex = /Bearer (.+)/;
			const match = regex.exec(authorization);
			const accessToken = match?.length === 2 ? match[1] : undefined;

			await validateJwt(accessToken, aud);

			return { isValid: true, linkWithJwt };
		} catch (error) {
			return { isValid: false, error };
		}
	} catch (error) {
		throw new ApiError({
			message: `Unable to perform authorization [${error}]`,
		});
	}
};

export default doAuthN;
