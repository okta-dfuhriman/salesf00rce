// Okta SDKs
import * as OktaAuthJs from '@okta/okta-auth-js';
import * as OktaReact from '@okta/okta-react';

import { authConfig } from './config/authConfig';
import { AuthReducer, initialState } from '../providers/AuthProvider/AuthReducer';
import AuthProvider from '../providers/AuthProvider/AuthContext';
import AuthDispatchContext from '../providers/AuthProvider/AuthDispatcher';
import useAuthState from '../hooks/useAuthState';
import useAuthDispatch from '../hooks/useAuthDispatch';
import { Mutations, Queries, silentAuth, signInWithRedirect } from '../hooks';

export { Images, Icons } from './assets/images';

export const Auth = {
	Reducer: AuthReducer,
	Provider: AuthProvider,
	DispatchContext: AuthDispatchContext,
	config: authConfig,
	initialState,
	silentAuth,
	signInWithRedirect,
	useAuthDispatch,
	useAuthState,
};

export const Okta = {
	Auth: OktaAuthJs.OktaAuth,
	config: authConfig,
	...OktaReact,
	...OktaAuthJs,
};

export * as _ from 'lodash';
export * as LDS from '@salesforce/design-system-react';
export * as PropTypes from 'prop-types';
export * as React from 'react';
export * as ReactQuery from 'react-query';
export * as ReactRouter from 'react-router-dom';

export { Mutations, Queries };
export * as Errors from './utils/Errors';
export * as Utils from './utils';
