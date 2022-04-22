import { Auth, Okta, LDS, React, useEffect } from './common';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import './styles/App.css';

import useBodyClass from './hooks/useBodyClass';

import AppLoginCallback from './pages/LoginCallback';
import Profile from './pages/Profile';
import SecureApp from './components/SecureApp';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import UserLinkCallback from './pages/UserLinkCallback';

const oktaAuth = new Okta.Auth(Okta.config.oidc);

oktaAuth.start();

const App = () => {
	useBodyClass('tds-bg_sand');

	const { pathname } = useLocation();
	const navigate = useNavigate();
	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		navigate(Okta.toRelativeUrl(originalUri || '/', window.location.origin), { replace: true });

	// Setting page scroll to 0 when changing the route
	useEffect(() => {
		document.documentElement.scrollTop = 0;

		if (document?.scrollingElement) {
			document.scrollingElement.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<React.Suspense fallback={<LDS.Spinner variant='brand' />}>
			<Okta.Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
				<Auth.Provider>
					<LDS.IconSettings iconPath='/assets/icons'>
						<Routes>
							<Route path='/signin' element={<SignIn />} />
							<Route path='/login/callback' element={<AppLoginCallback />} />
							<Route path='/identities/callback' element={<UserLinkCallback />} />
							<Route element={<SecureApp />}>
								<Route path='/' element={<Profile />} />
								<Route path='settings' element={<Settings />} />
							</Route>
						</Routes>
					</LDS.IconSettings>
				</Auth.Provider>
			</Okta.Security>
		</React.Suspense>
	);
};

export default App;
