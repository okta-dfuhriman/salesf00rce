/** @format */
import { ApiError, Okta } from '../common';

import {
	getOAuthBaseUrl,
	removeNils,
	removeTrailingSlash,
	toQueryString,
} from '@okta/okta-auth-js';

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

const generateAuthUrl = async (sdk, options) => {
	try {
		const tokenParams = await sdk.token.prepareTokenParams(options);

		const baseUrl = getOAuthBaseUrl(sdk);
		const authorizeUrl =
			removeTrailingSlash(options?.authorizeUrl) ||
			sdk.options.authorizeUrl ||
			baseUrl + 'v1/authorize';

		// Use the query params to build the authorize url

		const authUrl = authorizeUrl + buildAuthorizeParams(tokenParams);

		return { authUrl, tokenParams };
	} catch (error) {
		throw new Error(`Unable to generate auth url [${error}]`);
	}
};

const useAuthActions = () => {
	try {
		const { authState, oktaAuth } = Okta.useOktaAuth();

		const silentAuth = async (dispatch, options) => {
			try {
				const config = {};

				dispatch({ type: 'SILENT_AUTH_STARTED' });

				// Check if we can get tokens using either a refresh_token or, if our tokens are expired, if getWithoutPrompt works.
				const isAuthenticated = await oktaAuth.isAuthenticated();

				console.log('isAuthenticated:', isAuthenticated);

				if (!isAuthenticated) {
					const hasSession = options?.hasSession || (await oktaAuth.session.exists());

					if (hasSession) {
						// Have a session but no tokens in tokenManager.
						// ** Hail Mary attempt to authenticate via existing session. **

						if (!options) {
							config.redirectUri = `${window.location.origin}/login/callback`;
						}

						const { tokens } = await oktaAuth.token.getWithoutPrompt(config);

						if (tokens) {
							await oktaAuth.tokenManager.setTokens(tokens);

							dispatch({
								type: 'SILENT_AUTH_SUCCESS',
								payload: { isAuthenticated },
							});
						}
					}
				}

				dispatch({
					type: 'SILENT_AUTH_COMPLETED',
				});

				return { isAuthenticated };
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'SILENT_AUTH_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const getUser = async (dispatch, userId, _user) => {
			try {
				dispatch({
					type: 'USER_FETCH_STARTED',
					payload: { isLoadingUserProfile: true },
				});

				let user = _user;

				const accessToken = oktaAuth.getAccessToken();
				const {
					payload: { uid: loggedInUserId },
				} = oktaAuth.token.decode(accessToken);

				const idToken = oktaAuth.getIdToken();
				const {
					payload: { idp },
				} = oktaAuth.token.decode(idToken);

				if (!user && userId) {
					const url = `${window.location.origin}/api/v1/users/${userId}`;

					const request = new Request(url);

					request.headers.append('Authorization', `Bearer ${accessToken}`);

					const response = await fetch(request);

					if (!response.ok) {
						const body = await response.json();
						console.error(body);
						throw new Error(JSON.stringify(body));
					}

					user = await response.json();
				}

				if (user) {
					// set active credential
					const { credentials = [] } = user;

					const _credentials = credentials.map(credential => {
						const {
							id,
							provider: { id: idpId, name },
						} = credential;

						const isLoggedIn =
							credentials.length === 1 ||
							(credentials.length === 2 && ['email', 'password'].includes(name)) ||
							(id === loggedInUserId && idpId === idp);

						return { ...credential, isLoggedIn };
					});

					user = { ...user, credentials: _credentials };

					localStorage.setItem('user', JSON.stringify(user));

					dispatch({
						type: 'USER_FETCH_SUCCEEDED',
						payload: {
							user: user,
							isLoadingUserProfile: false,
							isStaleUserProfile: false,
						},
					});

					return user;
				}
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({
						type: 'USER_FETCH_FAILED',
						error,
					});
				} else {
					throw new Error(error);
				}
			}
		};

		const getUserInfo = async dispatch => {
			try {
				const { isAuthenticated } = await silentAuth(dispatch);

				let payload = { isAuthenticated, isLoadingUserInfo: true };

				if (isAuthenticated) {
					if (dispatch) {
						dispatch({
							type: 'USER_INFO_FETCH_STARTED',
							payload,
						});
					}

					const userInfo = await oktaAuth.getUser();

					if (userInfo) {
						if (userInfo.headers) {
							delete userInfo.headers;
						}

						// const picture = user?.picture ?? process.env.REACT_APP_ASTRO;

						// const userInfo = { ...user, picture };

						payload = { ...payload, userInfo, isLoadingUserInfo: false };

						localStorage.setItem('userInfo', JSON.stringify(userInfo));
					}

					if (dispatch) {
						dispatch({ type: 'USER_INFO_FETCH_SUCCEEDED', payload });
					}
				}
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'USER_INFO_FETCH_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const loginWithModal = async (dispatch, options) => {
			try {
				console.debug('generating URL...');

				dispatch({ type: 'LOGIN_START_WITH_MODAL' });

				const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth, options);

				return dispatch({ type: 'LOGIN_PENDING', payload: { authUrl, tokenParams } });
			} catch (error) {
				if (dispatch) {
					console.log('loginWithModal error:', error);
					dispatch({ type: 'LOGIN_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const loginWithCredentials = async (dispatch, { username, password }) => {
			try {
				dispatch({ type: 'LOGIN_WITH_CREDENTIALS_STARTED' });

				oktaAuth
					.signInWithCredentials({ username, password, sendFingerprint: true })
					.then(async transaction => {
						if (transaction.status === 'SUCCESS') {
							oktaAuth.signInWithRedirect({ sessionToken: transaction.sessionToken });
						}
					});
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const login = async (dispatch, props) => {
			try {
				const { tokens, tokenParams, username, password, idp } = props || {};
				// eslint-disable-next-line camelcase
				const { authorizationCode, interaction_code } = tokenParams || {};

				if (username && password) {
					return await loginWithCredentials(dispatch, { username, password });
				}

				if (idp) {
					dispatch({ type: 'LOGIN_WITH_REDIRECT_STARTED' });

					return await oktaAuth.signInWithRedirect({ idp: idpMap[idp] });
				}

				// eslint-disable-next-line camelcase
				const isCodeExchange = authorizationCode || interaction_code || false;

				if (isCodeExchange) {
					const response = await oktaAuth.token.exchangeCodeForTokens(tokenParams);

					if (!response?.tokens) {
						return dispatch({
							type: 'LOGIN_ERROR',
							error: `No tokens in response. Something went wrong! [${response}]`,
						});
					}

					await oktaAuth.tokenManager.setTokens(response.tokens);

					await oktaAuth.authStateManager.updateAuthState();

					return dispatch({ type: 'LOGIN_SUCCESS', payload: { isAuthenticated: true } });
				}

				if (oktaAuth.isLoginRedirect() || tokens) {
					dispatch({ type: 'LOGIN_PENDING' });

					await oktaAuth.handleLoginRedirect();

					// await oktaAuth.storeTokensFromRedirect();

					// oktaAuth.removeOriginalUri();

					// await oktaAuth.authStateManager.updateAuthState();

					dispatch({ type: 'LOGIN_SUCCESS' });

					return await getUserInfo(dispatch);
				}

				if (!authState?.isAuthenticated) {
					oktaAuth.setOriginalUri(window.location.href);

					const hasSession = await oktaAuth.session.exists();

					if (!hasSession) {
						const loginHint = props?.loginhint;

						return await loginWithModal(dispatch, { loginHint });
					}

					return await silentAuth(dispatch, { hasSession });
				}
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		// const resetPassword = async (dispatch, { username, verificationCode }) => {
		// 	try {
		// 		const { status, nextStep: { inputs } } = await oktaAuth.idx.recoverPassword({ username, authenticators: ['okta_email'] });

		// 		const { status, nextStep: { inputs }} = await oktaAuth.idx.proceed({ verificationCode })

		// 	} catch (error) {
		// 		if (dispatch) {
		// 			dispatch({ type: actions.recovery.error.type, error });
		// 		} else {
		// 			throw new Error(error);
		// 		}
		// 	}

		// }

		const logout = (dispatch, postLogoutRedirect) => {
			let config = {};

			if (postLogoutRedirect) {
				config = { postLogoutRedirectUri: postLogoutRedirect };
			}
			dispatch({ type: 'LOGOUT_STARTED' });

			console.info('executing logout...');

			localStorage.removeItem('user');

			return oktaAuth.signOut(config).then(() => dispatch({ type: 'LOGOUT_SUCCEEDED' }));
		};

		const toggleSignUp = (dispatch, isSignUp) =>
			dispatch({
				type: 'LOGIN_INIT_SIGN_UP'.type,
				payload: { isSignUp: !isSignUp },
			});

		const toggleEmailAuth = (dispatch, { isRecovery, isSignUp, isEmailAuth }) => {
			if (isRecovery) {
				dispatch({
					type: 'LOGIN_INIT_WITH_EMAIL'.type,
					payload: { isRecovery: !isRecovery, isEmailAuth: false },
				});
			} else if (isSignUp) {
				dispatch({ type: 'LOGIN_INIT_SIGN_UP'.type, payload: { isEmailAuth: !isEmailAuth } });
			} else {
				dispatch({
					type: 'LOGIN_INIT_WITH_EMAIL'.type,
					payload: { isEmailAuth: !isEmailAuth },
				});
			}
		};

		const linkUser = async (dispatch, idp, isModal = false) => {
			try {
				// 1) Update the redirect_uri. This will need to be restored after!
				const LINK_REDIRECT_URI = `${window.location.origin}/identities/callback`;

				oktaAuth.options.redirectUri = LINK_REDIRECT_URI;

				if (oktaAuth.isLoginRedirect()) {
					// const { state } = await oktaAuth.parseOAuthResponseFromUrl(oktaAuth);
					dispatch({
						type: 'USER_LINK_PENDING',
					});

					const primaryAccessToken = oktaAuth.getAccessToken();

					// The `sub` claim will always be the subject of the accessToken. The `uid` will represent that user that is actually logged in.
					const {
						payload: { uid },
					} = await oktaAuth.token.decode(primaryAccessToken);

					await oktaAuth.handleLoginRedirect();

					const linkAccessToken = oktaAuth.getAccessToken();

					const options = {
						method: 'post',
						headers: {
							Authorization: `Bearer ${primaryAccessToken}`,
						},
						body: JSON.stringify({
							linkWith: linkAccessToken,
						}),
					};

					const url = `${window.location.origin}/api/v1/users/${uid}/identities`;

					const response = await fetch(url, options);

					if (!response.ok) {
						throw new Error(await response.json());
					}

					await oktaAuth.tokenManager.renew('accessToken');

					dispatch({
						type: 'USER_LINK_SUCCEEDED',
					});

					// restore the redirect_uri
					oktaAuth.options.redirectUri = `${window.location.origin}/login/callback`;

					return;
				}
				// else if (isModal) {
				// 	const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth, {
				// 		idp: idpMap[idp],
				// 		prompt: 'login',
				// 		display: 'iframe',
				// 	});

				// 	return dispatch({
				// 		type: 'USER_LINK_STARTED',
				// 		payload: { authUrl, tokenParams },
				// 	});
				else {
					const scopes = oktaAuth.options.scopes;

					dispatch({
						type: 'USER_LINK_STARTED',
					});

					console.info(' ===== CURRENT ORIGINAL URI ===== ');
					console.log(oktaAuth.getOriginalUri());

					// Ensures we reroute to the /settings page where we started.
					await oktaAuth.setOriginalUri(window.location.href);

					console.info(' ===== NOW RETURNING TO ===== ');
					console.log(oktaAuth.getOriginalUri());

					const options = {
						idp: idpMap[idp],
						prompt: 'login',
						scopes: [...scopes, 'user:link'],
					};

					if (idp === 'email' || idp === 'password') {
						delete options.idp;

						options['loginHint'] = 'email';
					}
					console.log(options);

					await oktaAuth.signInWithRedirect(options);
				}

				// call /api/v1/users/{{userId}}/identities
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'USER_LINK_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const unlinkUser = async (dispatch, credential) => {
			try {
				dispatch({ type: 'USER_UNLINK_STARTED' });

				const {
					id,
					provider: { id: idpId },
					isLoggedIn,
				} = credential;

				if (isLoggedIn) {
					throw new Error('Cannot disconnect the currently logged in account.');
				}

				const baseUrl = `${window.location.origin}/api/v1/users/${id}/identities`;

				const url = idpId ? baseUrl + `/${idpId}` : baseUrl;

				const options = {
					method: 'delete',
					headers: {
						authorization: `Bearer ${oktaAuth.getAccessToken()}`,
					},
				};

				const response = await fetch(url, options);

				if (response.status !== 204) {
					throw new ApiError({
						statusCode: response.statusCode,
						message: `Unable to unlink user ${id}`,
						json: (await response.json()) || '',
					});
				}

				return dispatch({ type: 'USER_UNLINK_SUCCEEDED' });
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'USER_UNLINK_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		return {
			getUser,
			getUserInfo,
			linkUser,
			login,
			loginWithModal,
			logout,
			silentAuth,
			toggleEmailAuth,
			toggleSignUp,
			unlinkUser,
		};
	} catch (error) {
		// console.error(`init error [${error}]`);
		throw new Error(`useAuthActions init error [${error}]`);
	}
};

export default useAuthActions;
