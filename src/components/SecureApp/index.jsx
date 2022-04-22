import React from 'react';
import { Outlet } from 'react-router-dom';

import { Auth, LDS, Okta } from '../../common';
import Header from '../../components/Header';

import './styles.css';

const SecureApp = ({ onAuthRequired, children }) => {
	const { oktaAuth, _onAuthRequired } = Okta.useOktaAuth();
	const { signInWithRedirect } = Auth.useAuthActions();
	const { isAuthenticated } = Auth.useAuthState();
	const pendingLogin = React.useRef(false);

	React.useEffect(() => {
		const handleLogin = async () => {
			if (pendingLogin.current) {
				return;
			}

			pendingLogin.current = true;

			const originalUri = Okta.toRelativeUrl(window.location.href, window.location.origin);

			oktaAuth.setOriginalUri(originalUri);

			const onAuthRequiredFn = onAuthRequired || _onAuthRequired;

			if (onAuthRequiredFn) {
				await onAuthRequiredFn(oktaAuth);
			} else {
				await signInWithRedirect();
			}
		};

		if (!oktaAuth) {
			return;
		}

		if (isAuthenticated) {
			pendingLogin.current = false;
			return;
		}

		if (!isAuthenticated) {
			handleLogin();
		}
	}, [isAuthenticated, oktaAuth, onAuthRequired, _onAuthRequired, signInWithRedirect]);

	if (!isAuthenticated) {
		return <LDS.Spinner variant='inverse' size='large' containerClassName='sign-in-loader' />;
	}

	if (children) {
		return children;
	}

	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default SecureApp;
