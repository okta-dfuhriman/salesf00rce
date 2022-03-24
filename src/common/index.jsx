import React, { Fragment, createContext, useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';

import * as _ from 'lodash';

// Okta SDKs
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';

import AuthProvider from '../providers/AuthProvider/AuthContext';
import AuthDispatchContext from '../providers/AuthProvider/AuthDispatcher';
import { actions } from '../providers/AuthProvider/AuthReducer';
import useAuthActions from '../hooks/useAuthActions';
import useAuthDispatch from '../hooks/useAuthDispatch';
import useAuthState from '../hooks/useAuthState';

import {
	Avatar,
	Button,
	Card,
	Combobox,
	Icon,
	IconSettings,
	Input,
	InputIcon,
	MediaObject,
	Modal,
	Tooltip,
} from '@salesforce/design-system-react';

const Auth = {
	Provider: AuthProvider,
	DispatchContext: AuthDispatchContext,
	useAuthDispatch,
	useAuthState,
	useAuthActions,
};

const LDS = {
	Avatar,
	Button,
	Card,
	Combobox,
	Icon,
	IconSettings,
	Input,
	InputIcon,
	MediaObject,
	Modal,
	Tooltip,
};

const Okta = {
	Auth: OktaAuth,
	Security,
	toRelativeUrl,
};

export {
	Auth,
	React,
	Fragment,
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
