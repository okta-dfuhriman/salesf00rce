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
	isLoadingAuthenticators: false,
	isStaleUserProfile: false,
	factorsModalIsVisible: false,
	errors: [],
	...initialLoginState,
};

export const actions = {
	login: {
		cancel: { type: 'LOGIN_CANCEL' },
		error: { type: 'LOGIN_ERROR' },
		pending: { type: 'LOGIN_PENDING' },
		init: {
			withEmail: {
				type: 'LOGIN_INIT_WITH_EMAIL',
				state: {
					...initialLoginFormState,
					isEmailAuth: true,
					content: {
						header: {
							headline: 'Login with your email',
							subheadline: "Enter your email address and we'll send you a single-use code.",
						},
						primaryCTA: 'Log In',
					},
				},
			},
			signUp: {
				type: 'LOGIN_INIT_SIGN_UP',
				state: {
					...initialLoginFormState,
					isSignUp: true,
					content: {
						header: {
							headline: 'Sign up with your email',
							subheadline: "Enter your email address and we'll send you a single-use code.",
						},
						primaryCTA: 'Sign Up',
					},
				},
			},
			recovery: {
				type: 'LOGIN_INIT_RECOVERY',
				state: {
					...initialLoginFormState,
					isRecovery: true,
					content: {
						header: {
							headline: "Can't log in?",
							subheadline: "Enter your email address and we'll get you back on the trail.",
						},
						primaryCTA: 'Send Verification Email',
					},
				},
			},
		},
		start: {
			withModal: {
				type: 'LOGIN_START_WITH_MODAL',
				state: {
					isVisibleAuthIframe: true,
					isVisibleAuthModal: true,
					isLoadingLogin: true,
				},
			},
			withRedirect: { type: 'LOGIN_WITH_REDIRECT_STARTED' },
		},
		success: { type: 'LOGIN_SUCCESS', state: { ...initialLoginState } },
		silentAuth: {
			start: {
				type: 'SILENT_AUTH_START',
				state: {
					isLoadingLogin: true,
					isVisibleAuthModal: false,
					isVisibleAuthIframe: false,
				},
			},
			success: {
				type: 'SILENT_AUTH_SUCCESS',
			},
			complete: {
				type: 'SILENT_AUTH_COMPLETE',
			},
			error: { type: 'SILENT_AUTH_ERROR' },
		},
	},
	recovery: {
		start: { type: 'RECOVERY_START' },
		success: { type: 'RECOVERY_SUCCESS' },
	},
	logout: {
		start: { type: 'LOGOUT_START' },
		success: {
			type: 'LOGOUT_SUCCESS',
			state: initialState,
		},
		error: { type: 'LOGOUT_ERROR' },
	},
	user: {
		fetchInfo: {
			start: { type: 'USER_INFO_FETCH_START' },
			success: { type: 'USER_INFO_FETCH_SUCCESS' },
			error: { type: 'USER_INFO_FETCH_ERROR' },
		},
		fetch: {
			start: { type: 'USER_FETCH_START' },
			success: { type: 'USER_FETCH_SUCCESS' },
			error: { type: 'USER_FETCH_ERROR' },
		},
		link: {
			pending: { type: 'USER_LINK_PENDING' },
			start: {
				type: 'USER_LINK_START',
				state: {
					isLoadingLogin: true,
				},
			},
			success: { type: 'USER_LINK_SUCCESS' },
			error: { type: 'USER_LINK_ERROR' },
		},
		unlink: {
			pending: { type: 'USER_UNLINK_PENDING' },
			start: {
				type: 'USER_UNLINK_START',
				state: {
					isLoadingLogin: true,
					isLoadingUserInfo: true,
					isLoadingUserProfile: true,
				},
			},
			success: { type: 'USER_UNLINK_SUCCESS', state: { isStaleUserProfile: true } },
			error: { type: 'USER_UNLINK_ERROR' },
		},
	},
};

export const AuthReducer = (state, action) => {
	try {
		console.log('===== ACTION =====');
		console.log(JSON.stringify(action, null, 2));
		switch (action?.type) {
			case actions.recovery.start.type:
			case actions.user.link.pending.type:
			case actions.user.link.success.type:
			case actions.recovery.success.type:
				return _.merge({}, state, action?.payload);
			case actions.user.unlink.success.type:
				return _.merge({}, state, actions.user.unlink.success.state, action?.payload);
			case actions.user.unlink.start.type:
				return _.merge({}, state, actions.user.unlink.start.state, action?.payload);
			case actions.user.link.start.type:
				return _.merge({}, state, actions.user.link.start.state, action?.payload);
			case actions.login.pending.type:
				return _.merge({}, state, actions.login.pending?.state, action?.payload);
			case actions.login.init.withEmail.type:
				return _.merge({}, state, actions.login.init.withEmail.state, action?.payload);
			case actions.login.init.signUp.type:
				return _.merge({}, state, actions.login.init.signUp.state, action?.payload);
			case actions.login.init.recovery.type:
				return _.merge({}, state, actions.login.init.recovery.state, action?.payload);
			case actions.login.start.withRedirect.type:
			case actions.login.silentAuth.start.type:
				return _.merge({}, state, actions.login.silentAuth.start.state, action?.payload);
			case actions.login.start.withModal.type:
				return _.merge({}, state, actions.login.start.withModal.state, action?.payload);
			case actions.login.cancel.type:
			case actions.login.silentAuth.complete.type:
			case actions.login.silentAuth.success.type:
			case actions.user.fetch.success.type:
			case actions.user.fetchInfo.success.type:
			case actions.login.success.type:
				return _.merge({}, state, actions.login.success.state, action?.payload);
			case actions.user.fetch.start.type:
			case actions.user.fetchInfo.start.type:
				return _.merge({}, state, action?.payload, actions.user.fetch.start.state);
			case actions.user.fetch.error.type:
			case actions.user.fetchInfo.error.type:
			case actions.user.link.error.type:
			case actions.user.unlink.error.type:
			case actions.login.error.type:
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
