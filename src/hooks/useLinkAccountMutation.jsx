import { Okta, ReactQuery } from '../common';

const GOOGLE_IDP_ID = '0oa3cdpdvdd3BHqDA1d7';
const LINKEDIN_IDP_ID = '0oa3cdljzgEyGBMez1d7';
const APPLE_IDP_ID = '';
const FACEBOOK_IDP_ID = '0oa3cdkzv0cGPFifd1d7';
const SALESFORCE_IDP_ID = '0oa3cdq1662ouS1uG1d7';

const idpMap = {
	google: GOOGLE_IDP_ID,
	linkedin: LINKEDIN_IDP_ID,
	apple: APPLE_IDP_ID,
	facebook: FACEBOOK_IDP_ID,
	salesforce: SALESFORCE_IDP_ID,
	[GOOGLE_IDP_ID]: 'google',
	[LINKEDIN_IDP_ID]: 'linkedin',
	[FACEBOOK_IDP_ID]: 'facebook',
	[SALESFORCE_IDP_ID]: 'salesforce',
};

const linkAccountMutationFn = async options => {
	const { dispatch, idp, oktaAuth, queryClient } = options || {};

	try {
		const scopes = oktaAuth.options.scopes;

		dispatch({
			type: 'USER_LINK_STARTED',
		});

		const authParams = {
			idp: idpMap[idp],
			prompt: 'login',
			scopes: [...scopes, 'user:link'],
		};

		if (idp === 'email' || idp === 'password') {
			delete authParams.idp;

			authParams['loginHint'] = 'email';
		}

		const primaryAccessTokenJWT = await oktaAuth.getAccessToken();

		// The `sub` claim will always be the subject of the accessToken. The `uid` will represent that user that is actually logged in.
		const {
			payload: { uid },
		} = await oktaAuth.token.decode(primaryAccessTokenJWT);

		const {
			tokens: { accessToken: linkAccessToken },
		} = await oktaAuth.token.getWithPopup(authParams);

		if (!linkAccessToken) {
			throw new Error(`No tokens returned from popup!`);
		}

		const { accessToken: linkAccessTokenJWT, tokenType } = linkAccessToken;

		const requestOptions = {
			method: 'post',
			headers: {
				Authorization: `${tokenType} ${primaryAccessTokenJWT}`,
			},
			body: JSON.stringify({ linkWith: linkAccessTokenJWT }),
		};

		const url = `${window.location.origin}/api/v1/users/${uid}/identities`;

		const response = await fetch(url, requestOptions);

		if (!response.ok) {
			throw new Error(await response.json());
		}

		// Refresh the tokens after the linking has been done.
		const { tokens: renewedTokens } = await oktaAuth.token.getWithoutPrompt();

		if (!renewedTokens) {
			throw new Error('Unable to renew the tokens. Something went wrong!');
		}

		// Update the tokenManager, which will trigger a userInfo query.
		await oktaAuth.tokenManager.setTokens(renewedTokens);

		// Fetch new profile data
		await queryClient.setQueryData(['user', 'profile']);

		return dispatch({
			type: 'USER_LINK_SUCCEEDED',
		});
	} catch (error) {
		let actionType = 'USER_LINK_FAILED';
		let result = 'error';

		// If user cancels the flow by closing the popup the following error is thrown
		if (
			error?.name === 'AuthSdkError' &&
			error?.errorSummary === 'Unable to parse OAuth flow response'
		) {
			actionType = 'USER_LINK_CANCELLED';
			result = 'cancelled';
		}

		if (dispatch) {
			dispatch({ type: actionType, error });
		}

		if (error instanceof Error) {
			throw error;
		}

		if (result !== 'error') {
			return false;
		}

		throw new Error(error);
	}
};

const useLinkAccountMutation = options => {
	const { oktaAuth } = Okta.useOktaAuth();

	const { queryClient } = options || {};

	return ReactQuery.useMutation(idp => linkAccountMutationFn({ ...options, idp, oktaAuth }), {
		mutationKey: ['account-link'],
	});
};

export default useLinkAccountMutation;
