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
import { authConfig } from './config/authConfig';

import AuthProvider from '../providers/AuthProvider/AuthContext';
import AuthDispatchContext from '../providers/AuthProvider/AuthDispatcher';
import useAuthDispatch from '../hooks/useAuthDispatch';
import useAuthState from '../hooks/useAuthState';

import * as LDS from '@salesforce/design-system-react';

export { Images, Icons } from './assets/images';

export const Auth = {
	Provider: AuthProvider,
	DispatchContext: AuthDispatchContext,
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

export { Link, React, PropTypes, _, LDS };

export * as ReactQuery from 'react-query';
export * from '../hooks/useUserProfileQuery';
export * from '../hooks/useUserInfoQuery';
export * from '../hooks/useLoginMutation';
export * from '../hooks/useLogoutMutation';
export { default as useUnlinkAccountMutation } from '../hooks/useUnlinkAccountMutation';
export { default as useLinkAccountMutation } from '../hooks/useLinkAccountMutation';
export { default as useLockBodyScroll } from '../hooks/useLockBodyScroll';
export { default as ApiError } from './utils/ApiError';
export { default as AppError } from './utils/AppError';
export * from './utils';
