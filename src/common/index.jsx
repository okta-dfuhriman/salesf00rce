import * as React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as _ from 'lodash';

// Okta SDKs
import {
	OktaAuth,
	toRelativeUrl,
	removeNils,
	getOAuthUrls,
	toQueryString,
} from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security, useOktaAuth } from '@okta/okta-react';
import * as LDS from '@salesforce/design-system-react';

import { authConfig } from './config/authConfig';

import AuthProvider from '../providers/AuthProvider/AuthContext';
import AuthDispatchContext from '../providers/AuthProvider/AuthDispatcher';
import useAuthState from '../hooks/useAuthState';
import useAuthDispatch from '../hooks/useAuthDispatch';
import { Mutations, Queries, silentAuth, signInWithRedirect } from '../hooks';

export { Images, Icons } from './assets/images';

export const Auth = {
	Provider: AuthProvider,
	DispatchContext: AuthDispatchContext,
	silentAuth,
	signInWithRedirect,
	useAuthDispatch,
	useAuthState,
};

export const Okta = {
	Auth: OktaAuth,
	LoginCallback,
	Security,
	SecureRoute,
	toRelativeUrl,
	useOktaAuth,
	removeNils,
	getOAuthUrls,
	toQueryString,
	config: authConfig,
};

export { LDS, Link, Mutations, Queries, PropTypes, React, _ };

export * as ReactQuery from 'react-query';

export { default as ApiError } from './utils/ApiError';
export { default as AppError } from './utils/AppError';
export * from './utils';
