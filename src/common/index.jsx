import React, { Fragment, createContext, useEffect, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import * as _ from 'lodash';

// Okta SDKs
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security, useOktaAuth } from '@okta/okta-react';
import * as OktaUtils from './utils/OktaUtils';

import config from './config';

import AuthProvider from '../providers/AuthProvider/AuthContext';
import AuthDispatchContext from '../providers/AuthProvider/AuthDispatcher';
import useAuthActions from '../hooks/useAuthActions';
import useAuthDispatch from '../hooks/useAuthDispatch';
import useAuthState from '../hooks/useAuthState';

import {
	AppLauncher,
	AppLauncherExpandableSection,
	Avatar,
	Button,
	Card,
	Combobox,
	Dropdown,
	DropdownTrigger,
	Icon,
	IconSettings,
	Input,
	InputIcon,
	MediaObject,
	Modal,
	Spinner,
	Tooltip,
	VerticalNavigation,
} from '@salesforce/design-system-react';

const Auth = {
	Provider: AuthProvider,
	DispatchContext: AuthDispatchContext,
	useAuthDispatch,
	useAuthState,
	useAuthActions,
};

const LDS = {
	AppLauncher,
	AppLauncherExpandableSection,
	Avatar,
	Button,
	Card,
	Combobox,
	Dropdown,
	DropdownTrigger,
	Icon,
	IconSettings,
	Input,
	InputIcon,
	MediaObject,
	Modal,
	Spinner,
	Tooltip,
	VerticalNavigation,
};

const Okta = {
	Auth: OktaAuth,
	LoginCallback,
	Security,
	SecureRoute,
	toRelativeUrl,
	config,
	useOktaAuth,
	Utils: OktaUtils,
};

export {
	Auth,
	React,
	Fragment,
	Link,
	createContext,
	useEffect,
	useReducer,
	useState,
	Okta,
	PropTypes,
	_,
	LDS,
};

export { default as config } from './config';
export { default as ApiError } from './utils/ApiError';
