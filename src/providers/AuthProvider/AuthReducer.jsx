/** @format */

import * as _ from 'lodash';

export const initialState = {
	isError: false,
	isLoading: false,
	isLoadingLogin: false,
	isAuthenticated: false,
	isLoadingProfile: false,
	isLoadingAuthenticators: false,
	authModalIsVisible: false,
	factorsModalIsVisible: false,
	errors: [],
};

const initialLoginState = {
	isLoadingLogin: false,
	isVisibleAuthIframe: false,
	isVisibleAuthModal: false,
	isAuthenticated: false,
};

export const actions = {
	authenticators: {
		enroll: {
			cancel: {
				type: 'AUTHENTICATORS_ENROLL_CANCEL',
			},
			error: { type: 'AUTHENTICATORS_ENROLL_ERROR' },
			start: { type: 'AUTHENTICATORS_ENROLL_START' },
			success: { type: 'AUTHENTICATORS_ENROLL_SUCCESS' },
		},
		fetch: {
			error: { type: 'AUTHENTICATORS_FETCH_ERROR' },
			start: { type: 'AUTHENTICATORS_FETCH_START' },
			success: { type: 'AUTHENTICATORS_FETCH_SUCCESS' },
		},
	},
	login: {
		cancel: { type: 'LOGIN_CANCEL' },
		error: { type: 'LOGIN_ERROR' },
		start: {
			withCredentials: { type: 'LOGIN_START_WITH_CREDENTIALS' },
			withIframe: {
				type: 'LOGIN_START_WITH_IFRAME',
			},
			withModal: {
				type: 'LOGIN_START_WITH_MODAL',
				state: {
					isVisibleAuthIframe: true,
					isVisibleAuthModal: true,
					isLoadingLogin: true,
				},
			},
			withRedirect: { type: 'LOGIN_START_WITH_REDIRECT' },
		},
		started: {
			type: 'LOGIN_STARTED',
			state: {
				isVisibleAuthIframe: true,
				isVisibleAuthModal: true,
				isLoadingLogin: false,
			},
		},
		success: { type: 'LOGIN_SUCCESS', state: initialLoginState },
		silentAuth: {
			start: {
				type: 'SILENT_AUTH_START',
				state: {
					isLoadingLogin: true,
					isVisibleAuthModal: false,
					isVisibleAuthIframe: false,
				},
			},
			success: { type: 'SILENT_AUTH_SUCCESS' },
			complete: { type: 'SILENT_AUTH_COMPLETE' },
			error: { type: 'SILENT_AUTH_ERROR' },
		},
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
		fetch: {
			start: { type: 'USER_FETCH_START', state: { isLoadingProfile: true } },
			success: { type: 'USER_FETCH_SUCCESS' },
			error: { type: 'USER_FETCH_ERROR' },
		},
	},
};

export const AuthReducer = (state, action) => {
	try {
		switch (action?.type) {
			case actions.login.started.type:
				return _.merge({}, state, action?.payload, actions.login.started.state);
			case actions.login.silentAuth.start.type:
				return _.merge({}, state, action?.payload, actions.login.silentAuth.start.state);
			case actions.login.start.withModal.type:
				return _.merge({}, state, action?.payload, actions.login.start.withModal.state);
			case actions.login.silentAuth.success.type:
			case actions.login.silentAuth.complete.type:
			case actions.login.cancel.type:
			case actions.login.success.type:
				return _.merge({}, state, action?.payload, initialLoginState);
			case actions.user.fetch.start.type:
				return _.merge({}, state, action?.payload, actions.user.fetch.start.state);
			case actions.user.fetch.error.type:
			case actions.user.login.error.type:
				return _.merge({}, state, initialState, action?.payload, {
					error: action?.error,
					isError: true,
				});
			default:
				throw new Error(`Unhandled action type: ${action.type}`);
		}
	} catch (error) {
		throw new Error(`authReducer error: [${error}]`);
	}
};
