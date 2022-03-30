import AuthSdkError, { getResponseMode, isString, urlParamsToObject } from './helpers';

export const parseOAuthResponseFromUrl = (sdk, options) => {
	options = options || {};
	if (isString(options)) {
		options = { url: options };
	} else {
		// eslint-disable-next-line no-self-assign
		options = options;
	}

	const url = options.url;
	const responseMode = options.responseMode || getResponseMode(sdk);
	const nativeLoc = window.location;
	let paramStr;

	if (responseMode === 'query') {
		paramStr = url ? url.substring(url.indexOf('?')) : nativeLoc.search;
	} else {
		paramStr = url ? url.substring(url.indexOf('#')) : nativeLoc.hash;
	}

	if (!paramStr) {
		throw new AuthSdkError('Unable to parse a token from the url');
	}

	return urlParamsToObject(paramStr);
};
