/** @format */
import { ApiError, Okta } from '../common';
import { actions } from '../providers/AuthProvider/AuthReducer';

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

				dispatch({ type: actions.login.silentAuth.start.type });

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
								type: actions.login.silentAuth.success.type,
								payload: { isAuthenticated },
							});
						}
					}
				}

				dispatch({
					type: actions.login.silentAuth.complete.type,
				});

				return { isAuthenticated };
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: actions.login.silentAuth.error.type, error });
				} else {
					throw new Error(error);
				}
			}
		};

		const getUser = async (dispatch, userId, _user) => {
			try {
				dispatch({
					type: actions.user.fetch.start.type,
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
							provider: { id: idpId },
						} = credential;

						return { ...credential, isLoggedIn: id === loggedInUserId && idpId === idp };
					});

					user = { ...user, credentials: _credentials };

					localStorage.setItem('user', JSON.stringify(user));

					dispatch({
						type: actions.user.fetch.success.type,
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
						type: actions.user.fetch.error.type,
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
							type: actions.user.fetchInfo.start.type,
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
						dispatch({ type: actions.user.fetchInfo.success.type, payload });
					}
				}
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: actions.user.fetchInfo.error.type, error });
				} else {
					throw new Error(error);
				}
			}
		};

		const loginWithModal = async (dispatch, options) => {
			try {
				console.debug('generating URL...');

				dispatch({ type: actions.login.start.withModal.type });

				const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth, options);

				return dispatch({ type: actions.login.pending.type, payload: { authUrl, tokenParams } });
			} catch (error) {
				if (dispatch) {
					console.log('loginWithModal error:', error);
					dispatch({ type: actions.login.error.type, error });
				} else {
					throw new Error(error);
				}
			}
		};

		const loginWithCredentials = async (dispatch, { username, password }) => {
			try {
				dispatch({ type: actions.login.start.withCredentials.type });

				oktaAuth
					.signInWithCredentials({ username, password, sendFingerprint: true })
					.then(async transaction => {
						if (transaction.status === 'SUCCESS') {
							oktaAuth.signInWithRedirect({ sessionToken: transaction.sessionToken });
						}
					});
			} catch (error) {
				if (dispatch) {
					dispatch({ type: actions.login.error.type, error });
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
					dispatch({ type: actions.login.start.withRedirect.type });

					return await oktaAuth.signInWithRedirect({ idp: idpMap[idp] });
				}

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
					dispatch({ type: actions.login.pending.type });

					await oktaAuth.handleLoginRedirect();

					// await oktaAuth.storeTokensFromRedirect();

					// oktaAuth.removeOriginalUri();

					// await oktaAuth.authStateManager.updateAuthState();

					dispatch({ type: actions.login.success.type });

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
					dispatch({ type: actions.login.error.type, error });
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

			console.info('executing logout...');

			localStorage.removeItem('user');

			return oktaAuth.signOut(config).then(() => dispatch({ type: 'LOGOUT_SUCCESS' }));
		};

		const toggleSignUp = (dispatch, isSignUp) =>
			dispatch({
				type: actions.login.init.signUp.type,
				payload: { isSignUp: !isSignUp },
			});

		const toggleEmailAuth = (dispatch, { isRecovery, isSignUp, isEmailAuth }) => {
			if (isRecovery) {
				dispatch({
					type: actions.login.init.withEmail.type,
					payload: { isRecovery: !isRecovery, isEmailAuth: false },
				});
			} else if (isSignUp) {
				dispatch({ type: actions.login.init.signUp.type, payload: { isEmailAuth: !isEmailAuth } });
			} else {
				dispatch({
					type: actions.login.init.withEmail.type,
					payload: { isEmailAuth: !isEmailAuth },
				});
			}
		};

		const linkUser = async (dispatch, idp, isModal = false) => {
			try {
				// 1) Update the redirect_uri. This will need to be restored after!
				const LINK_REDIRECT_URI = `${window.location.origin}/identities/callback`;

				oktaAuth.options.redirectUri = LINK_REDIRECT_URI;
				console.log('=== CURRENT REDIRECT_URI ===');
				console.log(oktaAuth.options.redirectUri);

				if (oktaAuth.isLoginRedirect()) {
					// const { state } = await oktaAuth.parseOAuthResponseFromUrl(oktaAuth);
					dispatch({
						type: actions.user.link.pending.type,
						payload: {
							isLoadingLinkProfile: true,
						},
					});

					const primaryAccessToken = oktaAuth.getAccessToken();

					// The `sub` claim will always be the subject of the accessToken. The `uid` will represent that user that is actually logged in.
					const {
						payload: { uid },
					} = await oktaAuth.token.decode(primaryAccessToken);

					console.log('=== primaryAccessToken ===');
					console.log(primaryAccessToken);

					await oktaAuth.handleLoginRedirect();

					const linkAccessToken = oktaAuth.getAccessToken();
					console.log('=== linkAccessToken ===');
					console.log(linkAccessToken);

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
						type: actions.user.link.success.type,
						payload: {
							isLoadingLinkProfile: false,
							isStaleUserProfile: true,
						},
					});

					// restore the redirect_uri
					oktaAuth.options.redirectUri = `${window.location.origin}/login/callback`;
					console.log('=== CURRENT REDIRECT_URI ===');
					console.log(oktaAuth.options.redirectUri);

					return;
				}
				// else if (isModal) {
				// 	const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth, {
				// 		idp: idpMap[idp],
				// 		prompt: 'login',
				// 		display: 'iframe',
				// 	});

				// 	return dispatch({
				// 		type: actions.user.link.start.type,
				// 		payload: { authUrl, tokenParams },
				// 	});
				else {
					const scopes = oktaAuth.options.scopes;

					dispatch({
						type: actions.user.link.start.type,
						payload: { isLoadingLinkProfile: true },
					});

					// Ensures we reroute to the /settings page where we started.
					await oktaAuth.setOriginalUri(window.location.href);

					await oktaAuth.signInWithRedirect({
						idp: idpMap[idp],
						prompt: 'login',
						scopes: [...scopes, 'user:link'],
					});
				}

				// call /api/v1/users/{{userId}}/identities
			} catch (error) {
				if (dispatch) {
					dispatch({ type: actions.user.link.error.type, error });
				} else {
					throw new Error(error);
				}
			}
		};

		const unlinkUser = async (dispatch, primaryId, associatedId) => {
			try {
				dispatch({ type: actions.user.unlink.start.type });

				const url = `${window.location.origin}/api/v1/users/${associatedId}identities`;
				const options = {
					method: 'delete',
					headers: {
						authorization: `Bearer ${oktaAuth.getAccessToken()}`,
					},
				};

				const response = await fetch(url, options);

				if (response.statusCode !== 204) {
					throw new ApiError({
						statusCode: response.statusCode,
						message: `Unable to unlink user ${associatedId} from ${primaryId}`,
						json: await response.json(),
					});
				}

				return dispatch({ type: actions.user.unlink.success.type });
			} catch (error) {
				if (dispatch) {
					dispatch({ type: actions.user.unlink.error.type, error });
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
