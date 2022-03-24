/** @format */
import { actions } from '../providers/AuthProvider/AuthReducer';

import { useOktaAuth } from '@okta/okta-react';
import { removeNils, toQueryString } from '@okta/okta-auth-js';

const buildAuthorizeParams = tokenParams => {
	let params = {};

	const oAuthParamMap = {
		clientId: 'client_id',
		codeChallenge: 'code_challenge',
		codeChallengeMethod: 'code_challenge_method',
		display: 'display',
		idp: 'idp',
		idpScope: 'idp_scope',
		loginHint: 'login_hint',
		maxAge: 'max_age',
		nonce: 'nonce',
		prompt: 'prompt',
		redirectUri: 'redirect_uri',
		responseMode: 'response_mode',
		responseType: 'response_type',
		sessionToken: 'sessionToken',
		state: 'state',
		scopes: 'scope',
	};

	// eslint-disable-next-line no-restricted-syntax
	for (const [key, value] of Object.entries(tokenParams)) {
		const oAuthKey = oAuthParamMap[key];

		if (oAuthKey) {
			params[oAuthKey] = value;
		}
	}

	params.response_mode = 'okta_post_message';

	params = removeNils(params);

	return toQueryString(params);
};

const generateAuthUrl = async sdk => {
	try {
		const tokenParams = await sdk.token.prepareTokenParams();
		const { issuer, authorizeUrl } = sdk.options || {};

		// Use the query params to build the authorize url

		// Get authorizeUrl and issuer
		const url = authorizeUrl ?? `${issuer}/v1/authorize`;

		const authUrl = url + buildAuthorizeParams(tokenParams);

		return { authUrl, tokenParams };
	} catch (error) {
		throw new Error(`Unable to generate auth url [${error}]`);
	}
};

const useAuthActions = () => {
	try {
		const { authState, oktaAuth } = useOktaAuth();

		const silentAuth = async (dispatch, options) => {
			try {
				const config = {};

				let hasSession = options?.hasSession || (await oktaAuth.isAuthenticated());

				if (hasSession === undefined) {
					console.debug('checking for existing Okta session...');

					hasSession = await oktaAuth.session.exists();
				}

				if (hasSession) {
					dispatch({ type: actions.login.silentAuth.start.type });

					if (!options) {
						config.redirectUri = `${window.location.origin}/login/callback`;
					}

					const { tokens } = await oktaAuth.token.getWithoutPrompt(config);

					if (tokens) {
						await oktaAuth.tokenManager.setTokens(tokens);

						dispatch({ type: actions.login.silentAuth.success.type });
					}
				} else {
					dispatch({ type: actions.login.silentAuth.complete.type });
				}

				return hasSession;
			} catch (error) {
				if (dispatch) {
					// console.error(error);
					dispatch({ type: actions.login.silentAuth.error.type, error });
				} else {
					throw new Error(error);
				}
			}
		};

		const getUser = async dispatch => {
			try {
				const isAuthenticated = await silentAuth(dispatch);

				let payload = { isAuthenticated, isLoadingProfile: false };

				if (dispatch) {
					dispatch({
						type: actions.user.fetch.start.type,
						payload,
					});
				}

				const user = await oktaAuth.getUser();

				if (user) {
					if (user.headers) {
						delete user.headers;
					}

					payload = { ...payload, user };

					localStorage.setItem('user', JSON.stringify(user));
				}

				if (dispatch) {
					dispatch({ type: actions.user.fetch.success.type, payload });
				}
			} catch (error) {
				if (dispatch) {
					// console.error(error);
					dispatch({ type: actions.user.fetch.error.type, error });
				} else {
					throw new Error(error);
				}
			}
		};

		const loginWithiFrame = async (dispatch, options) => {
			try {
				const { loginHint } = options || {};

				if (loginHint) {
					console.debug('loginHint:', loginHint);
				}

				console.debug('generating URL...');

				dispatch({ type: actions.login.start.withIframe.type });

				const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth);

				return dispatch({ type: actions.login.started.type, payload: { authUrl, tokenParams } });
			} catch (error) {
				if (dispatch) {
					// console.error(error);
					dispatch({ type: actions.login.error.type, error });
				} else {
					throw new Error(error);
				}
			}
		};

		const login = async (dispatch, props) => {
			try {
				const { tokens, tokenParams } = props || {};
				// eslint-disable-next-line camelcase
				const { authorizationCode, interaction_code } = tokenParams || {};

				// eslint-disable-next-line camelcase
				const isCodeExchange = authorizationCode || interaction_code || false;

				if (isCodeExchange) {
					const response = await oktaAuth.token.exchangeCodeForTokens(tokenParams);

					if (!response?.tokens) {
						return dispatch({
							type: actions.login.error.type,
							error: `No tokens in response. Something went wrong! [${response}]`,
						});
					}

					await oktaAuth.tokenManager.setTokens(response.tokens);

					await oktaAuth.authStateManager.updateAuthState();

					return dispatch({ type: actions.login.success.type, payload: { isAuthenticated: true } });
				}

				if (oktaAuth.isLoginRedirect() || tokens) {
					dispatch({ type: actions.login.start.withRedirect.type });

					await oktaAuth.storeTokensFromRedirect();

					oktaAuth.removeOriginalUri();

					await oktaAuth.authStateManager.updateAuthState();

					return;
				}

				if (!authState?.isAuthenticated) {
					oktaAuth.setOriginalUri(window.location.href);

					const hasSession = await oktaAuth.session.exists();

					if (!hasSession) {
						const loginHint = props?.loginhint;

						return await loginWithiFrame(dispatch, { loginHint });
					}

					return await silentAuth(dispatch, { hasSession });
				}
			} catch (error) {
				if (dispatch) {
					dispatch({ type: actions.login.error.type, error });
				} else {
					throw new Error(error);
				}
			}
		};

		const logout = (dispatch, postLogoutRedirect) => {
			let config = {};

			if (postLogoutRedirect) {
				config = { postLogoutRedirectUri: postLogoutRedirect };
			}

			console.info('executing logout...');

			localStorage.removeItem('user');

			return oktaAuth.signOut(config).then(() => dispatch({ type: 'LOGOUT_SUCCESS' }));
		};

		return {
			getUser,
			login,
			loginWithiFrame,
			logout,
			silentAuth,
		};
	} catch (error) {
		// console.error(`init error [${error}]`);
		throw new Error(`useAuthActions init error [${error}]`);
	}
};

export default useAuthActions;
