/** @format */
import { _, ApiError, Okta } from '../common';

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
	grantType: 'grant_type',
};

const buildAuthorizeParams = tokenParams => {
	let params = {};

	for (const [key, value] of Object.entries(tokenParams)) {
		let oAuthKey = oAuthParamMap[key];

		if (oAuthKey) {
			if (oAuthKey === 'scope' && Array.isArray(value)) {
				params[oAuthKey] = value.join(' ');
			} else {
				params[oAuthKey] = value;
			}
		}
	}

	if (params?.idp) {
		params.display = 'popup';
	}

	params.response_mode = 'okta_post_message';

	params = Okta.removeNils(params);

	return Okta.toQueryString(params);
};

const generateAuthUrl = async (sdk, options) => {
	const tokenParams = await sdk.token.prepareTokenParams(options);
	const { issuer, authorizeUrl } = sdk.options || {};

	const urls = Okta.getOAuthUrls(sdk, tokenParams);

	const meta = {
		issuer,
		urls,
		...tokenParams,
	};

	// Use the query params to build the authorize url

	// Get authorizeUrl and issuer
	const url = authorizeUrl ?? `${issuer}/v1/authorize`;

	const authUrl = url + buildAuthorizeParams(tokenParams);

	sdk.transactionManager.save(meta, { oauth: true });

	return { authUrl, tokenParams };
};

const useAuthActions = () => {
	try {
		const { authState, oktaAuth } = Okta.useOktaAuth();

		const isAuthenticated = async dispatch => {
			const isAuthenticated = await oktaAuth.isAuthenticated();

			console.log('isAuthenticated:', isAuthenticated);

			dispatch({ type: 'AUTH_STATE_CHECKED', payload: { isAuthenticated } });

			return isAuthenticated;
		};

		const silentAuth = async (dispatch, options) => {
			try {
				const config = {};

				dispatch({ type: 'SILENT_AUTH_STARTED' });

				// Check if we can get tokens using either a refresh_token or, if our tokens are expired, if getWithoutPrompt works.
				const _isAuthenticated = await isAuthenticated(dispatch);

				let result = { type: 'SILENT_AUTH_ABORTED' };

				if (!_isAuthenticated) {
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

							await oktaAuth.authStateManager.updateAuthState();

							result = {
								type: 'SILENT_AUTH_SUCCESS',
							};
						}
					}
				}

				dispatch(result);

				return { isAuthenticated: _isAuthenticated };
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'SILENT_AUTH_ERROR', error });
				} else {
					throw new Error(error);
				}
			}
		};

		const getUserSync = async (userId, _user) => {
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
						(id === loggedInUserId && idpId === idp) ||
						(id === loggedInUserId && ['email', 'password'].includes(name));

					return { ...credential, isLoggedIn };
				});

				user = { ...user, credentials: _credentials };

				localStorage.setItem('user', JSON.stringify(user));

				return user;
			}
		};

		const getUser = async (dispatch, { userId, user: _user }) => {
			try {
				dispatch({
					type: 'USER_FETCH_STARTED',
				});

				const user = await getUserSync(userId, _user);

				const { profile = {}, credentials = [], linkedUsers = [] } = user || {};

				delete user.profile;
				delete user.credentials;
				delete user.linkedUsers;

				dispatch({
					type: 'USER_FETCH_SUCCEEDED',
					payload: { profile: { ...user, ...profile }, credentials, linkedUsers },
				});

				return user;
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

		const getUserInfoSync = async () => {
			const userInfo = await oktaAuth.getUser();

			if (userInfo) {
				if (userInfo.headers) {
					delete userInfo.headers;
				}

				localStorage.setItem('userInfo', JSON.stringify(userInfo));

				return userInfo;
			}
		};

		const getUserInfo = async dispatch => {
			try {
				if (dispatch) {
					dispatch({
						type: 'USER_INFO_FETCH_STARTED',
					});
				}

				const userInfo = await getUserInfoSync();

				if (dispatch) {
					dispatch({ type: 'USER_INFO_FETCH_SUCCEEDED', payload: { userInfo } });
				}
				return userInfo;
			} catch (error) {
				if (dispatch) {
					console.log(error);
					dispatch({ type: 'USER_INFO_FETCH_FAILED', error });
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

		const signInWithRedirect = async (dispatch, idp) => {
			let options = {};

			if (dispatch) {
				dispatch({ type: 'LOGIN_WITH_REDIRECT_STARTED' });
			}

			if (idp) {
				options = {
					...options,
					idp: idpMap[idp],
				};
			}

			return await oktaAuth.signInWithRedirect(options);
		};

		const login = async (dispatch, props) => {
			try {
				const { username, password, idp } = props || {};
				// eslint-disable-next-line camelcase

				if (username && password) {
					return await loginWithCredentials(dispatch, { username, password });
				}

				if (idp) {
					return await signInWithRedirect(dispatch, idp);
				}

				if (oktaAuth.isLoginRedirect()) {
					dispatch({ type: 'LOGIN_PENDING' });

					await oktaAuth.handleLoginRedirect();

					dispatch({ type: 'LOGIN_SUCCESS' });

					return await getUserInfo(dispatch);
				}

				if (!authState?.isAuthenticated) {
					oktaAuth.setOriginalUri(window.location.href);

					const hasSession = await oktaAuth.session.exists();

					if (!hasSession) {
						const loginHint = props?.loginhint;

						return await signInWithRedirect({ loginHint });
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

		const doUserLinking = async (dispatch, { tokens }) => {
			dispatch({ type: 'USER_LINK_PENDING' });

			const primaryAccessToken = await oktaAuth.getAccessToken();

			const {
				payload: { uid: primaryUid },
			} = await oktaAuth.token.decode(primaryAccessToken);

			const {
				accessToken: { accessToken: linkAccessToken },
			} = tokens || {};

			const options = {
				method: 'post',
				headers: {
					Authorization: `Bearer ${primaryAccessToken}`,
				},
				body: JSON.stringify({ linkWith: linkAccessToken }),
			};

			const url = `${window.location.origin}/api/v1/users/${primaryUid}/identities`;

			const response = await fetch(url, options);

			if (!response.ok) {
				throw new Error(await response.json());
			}

			const { tokens: freshTokens } = await oktaAuth.token.getWithoutPrompt();

			if (!freshTokens) {
				return dispatch({
					type: 'USER_LINK_FAILED',
					error: `Unable to obtain fresh tokens. Something went wrong!`,
				});
			}

			// Update the authState w/ the new tokens
			await oktaAuth.tokenManager.setTokens(freshTokens);

			// Because isPendingAccountLink === true a getUserInfo() will NOT be triggered.
			// So silently update userInfo
			const { sub: userId } = await getUserInfoSync();

			// And then silently update user
			const user = await getUserSync(userId);

			const { profile = {}, credentials = [], linkedUsers = [] } = user || {};

			delete user.profile;
			delete user.credentials;
			delete user.linkedUsers;

			return dispatch({
				type: 'USER_LINK_SUCCEEDED',
				payload: { profile: { ...user, ...profile }, credentials, linkedUsers },
			});
		};

		const linkModalCodeExchange = async (dispatch, data) => {
			dispatch({ type: 'USER_LINK_MODAL_CODE_EXCHANGE_STARTED' });

			const { state, code: authorizationCode, interaction_code: interactionCode } = data || {};

			const tokenParams = oktaAuth.transactionManager.load({
				oauth: true,
				pkce: true,
				state,
			});

			const response = await oktaAuth.token.exchangeCodeForTokens({
				...tokenParams,
				authorizationCode,
				interactionCode,
			});

			if (!response?.tokens) {
				return dispatch({
					type: 'USER_LINK_MODAL_CODE_EXCHANGE_FAILED',
					error: `No tokens in response. Something went wrong! [${response}]`,
				});
			}

			dispatch({ type: 'USER_LINK_MODAL_CODE_EXCHANGED' });

			return await doUserLinking(dispatch, { tokens: response.tokens });
		};

		const linkUserInteractive = async (dispatch, options) => {
			const { data, idp, display } = options || {};

			if (!_.isEmpty(data)) {
				return await linkModalCodeExchange(dispatch, data);
			} else if (display && display === 'popup') {
				dispatch({ type: 'USER_LINK_POPUP_STARTED' });

				const scopes = oktaAuth.options.scopes;

				const requestOptions = {
					idp: idpMap[idp],
					prompt: 'login',
					scopes: [...scopes, 'user:link'],
				};

				if (idp === 'email' || idp === 'password') {
					delete requestOptions.idp;

					requestOptions['loginHint'] = 'email';
				}

				const response = await oktaAuth.token.getWithPopup(requestOptions);

				const { tokens } = response || {};

				if (!tokens) {
					return dispatch({
						type: 'USER_LINK_POPUP_FAILED',
						error: `No tokens in response. Something went wrong! [${response}]`,
					});
				}

				dispatch({ type: 'USER_LINK_POPUP_CODE_EXCHANGED' });

				return await doUserLinking(dispatch, { tokens });
			} else {
				dispatch({ type: 'USER_LINK_MODAL_STARTED' });

				const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth, {
					idp: idpMap[idp],
					prompt: 'login',
				});

				if (authUrl && tokenParams) {
					return dispatch({
						type: 'USER_LINK_MODAL_PARAMS_GENERATED',
						payload: { authUrl, tokenParams },
					});
				}
			}
		};

		const linkUser = async (dispatch, options) => {
			try {
				const { idp, display } = options || {};

				if (display) {
					return await linkUserInteractive(dispatch, options);
				} else {
					// 1) Update the redirect_uri. This will need to be restored after!
					const LINK_REDIRECT_URI = `${window.location.origin}/identities/callback`;

					oktaAuth.options.redirectUri = LINK_REDIRECT_URI;

					if (oktaAuth.isLoginRedirect()) {
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

						const requestOptions = {
							method: 'post',
							headers: {
								Authorization: `Bearer ${primaryAccessToken}`,
							},
							body: JSON.stringify({
								linkWith: linkAccessToken,
							}),
						};

						const url = `${window.location.origin}/api/v1/users/${uid}/identities`;

						const response = await fetch(url, requestOptions);

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
					} else {
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

						const requestOptions = {
							idp: idpMap[idp],
							prompt: 'login',
							scopes: [...scopes, 'user:link'],
						};

						if (idp === 'email' || idp === 'password') {
							delete requestOptions.idp;

							requestOptions['loginHint'] = 'email';
						}
						console.log(requestOptions);

						await oktaAuth.signInWithRedirect(requestOptions);
					}
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

				await oktaAuth.tokenManager.renew('accessToken');

				return dispatch({ type: 'USER_UNLINK_SUCCEEDED', item: credential });
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'USER_UNLINK_FAILED', error });
				} else {
					throw new Error(error);
				}
			}
		};

		return {
			getUserSync,
			getUser,
			getUserInfo,
			isAuthenticated,
			linkUser,
			login,
			logout,
			signInWithRedirect,
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
