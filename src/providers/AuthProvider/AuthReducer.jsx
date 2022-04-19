/** @format */

import { _ } from '../../common';

const initialLoginFormState = {
	isSignUp: false,
	isEmailAuth: false,
	isRecovery: false,
};

const initialLoginState = {
	isLoadingLogin: false,
	isVisibleAuthIframe: false,
	isVisibleAuthModal: false,
	...initialLoginFormState,
};

export const initialState = {
	isError: false,
	isAuthenticated: false,
	isLoading: false,
	isLoadingUserInfo: false,
	isLoadingUserProfile: false,
	isLoadingLinkProfile: false,
	isLoadingLogout: false,
	isLoadingAuthenticators: false,
	isStaleUserProfile: false,
	factorsModalIsVisible: false,
	errors: [],
	...initialLoginState,
};

export const AuthReducer = (state, action) => {
	try {
		let tempState = {};

		console.log('===== ACTION =====');
		console.log(JSON.stringify(action, null, 2));
		switch (action?.type) {
			// CREDENTIAL RECOVERY
			case 'RECOVERY_STARTED':
				return { ...state, ...tempState, ...action?.payload };
			case 'RECOVERY_SUCCEEDED':
				return { ...state, ...tempState, ...action?.payload };

			// LOGIN
			case 'LOGIN_CANCELLED':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_INIT_WITH_EMAIL'.type:
				tempState = {
					...initialLoginFormState,
					isEmailAuth: true,
					content: {
						header: {
							headline: 'Login with your email',
							subheadline: "Enter your email address and we'll send you a single-use code.",
						},
						primaryCTA: 'Log In',
					},
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_INIT_SIGN_UP'.type:
				tempState = {
					...initialLoginFormState,
					isSignUp: true,
					content: {
						header: {
							headline: 'Sign up with your email',
							subheadline: "Enter your email address and we'll send you a single-use code.",
						},
						primaryCTA: 'Sign Up',
					},
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_INIT_RECOVERY'.type:
				tempState = {
					...initialLoginFormState,
					isRecovery: true,
					content: {
						header: {
							headline: "Can't log in?",
							subheadline: "Enter your email address and we'll get you back on the trail.",
						},
						primaryCTA: 'Send Verification Email',
					},
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_PENDING':
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGOUT_STARTED':
				tempState = {
					isLoadingLogout: true,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_START_WITH_MODAL':
				tempState = {
					isVisibleAuthIframe: true,
					isVisibleAuthModal: true,
					isLoadingLogin: true,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_SUCCESS':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGIN_WITH_REDIRECT_STARTED':
				tempState = {
					isLoadingLogin: true,
					isVisibleAuthModal: false,
					isVisibleAuthIframe: false,
				};
				return { ...state, ...tempState, ...action?.payload };

			// LOGOUT
			case 'LOGOUT_SUCCEEDED':
				tempState = {
					isLoadingLogout: false,
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };

			// SILENT AUTH
			case 'SILENT_AUTH_COMPLETED':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'SILENT_AUTH_STARTED':
				tempState = {
					isLoadingLogin: true,
					isVisibleAuthModal: false,
					isVisibleAuthIframe: false,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'SILENT_AUTH_SUCCESS':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };

			// USER FETCH
			case 'USER_FETCH_STARTED':
			case 'USER_INFO_FETCH_STARTED':
				tempState = {};

				return { ...state, ...tempState, ...action?.payload };

			case 'USER_FETCH_SUCCEEDED':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'USER_INFO_FETCH_SUCCEEDED':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };

			// USER LINK
			case 'USER_LINK_PENDING':
				tempState = {
					isLoadingLinkProfile: true,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'USER_LINK_STARTED':
				tempState = {
					isLoadingLogin: true,
					isLoadingLinkProfile: true,
				};
				return { ...state, ...tempState, ...action?.payload };
			case 'USER_LINK_SUCCEEDED':
				tempState = {
					isLoadingLinkProfile: false,
					isStaleUserProfile: true,
				};
				return { ...state, ...tempState, ...action?.payload };

			// USER UNLINK
			case 'USER_UNLINK_STARTED':
				localStorage.removeItem('user');
				delete state?.user;

				tempState = {
					isLoadingLinkProfile: true,
				};

				return { ...state, ...tempState, ...action?.payload };
			case 'USER_UNLINK_SUCCEEDED':
				tempState = {
					isLoadingLinkProfile: false,
					isStaleUserProfile: true,
				};
				return { ...state, ...tempState, ...action?.payload };

			// ERRORS
			case 'LOGIN_ERROR':
			case 'SILENT_AUTH_ERROR':
			case 'USER_FETCH_FAILED':
			case 'USER_INFO_FETCH_FAILED':
			case 'USER_LINK_FAILED':
			case 'USER_UNLINK_FAILED':
				console.log('login error:', action);
				return _.merge({}, state, initialState, action?.payload, {
					error: action?.error,
					isError: true,
				});
			default:
				throw new Error(`Unhandled action type: ${action?.type}`);
		}
	} catch (error) {
		throw new Error(`authReducer error: [${error}]`);
	}
};
