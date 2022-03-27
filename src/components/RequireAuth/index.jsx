import React from 'react';
import { Outlet } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { toRelativeUrl } from '@okta/okta-auth-js';

const RequireAuth = ({ onAuthRequired, children }) => {
	const { authState, oktaAuth, _onAuthRequired } = useOktaAuth();
	const pendingLogin = React.useRef(false);

	React.useEffect(() => {
		const handleLogin = async () => {
			if (pendingLogin.current) {
				return;
			}

			pendingLogin.current = true;

			const originalUri = toRelativeUrl(window.location.href, window.location.origin);

			oktaAuth.setOriginalUri(originalUri);

			const onAuthRequiredFn = onAuthRequired || _onAuthRequired;

			if (onAuthRequiredFn) {
				await onAuthRequiredFn(oktaAuth);
			} else {
				await oktaAuth.signInWithRedirect();
			}
		};

		if (!authState) {
			return;
		}

		if (authState.isAuthenticated) {
			pendingLogin.current = false;
			return;
		}

		if (!authState.isAuthenticated) {
			handleLogin();
		}
	}, [authState, authState?.isAuthenticated, oktaAuth, onAuthRequired, _onAuthRequired]);

	if (!authState || !authState.isAuthenticated) {
		return null;
	}

	if (children) {
		return children;
	}

	return <Outlet />;
};

export default RequireAuth;
