import { Auth, Okta, LDS, React, useEffect } from './common';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import './styles/App.css';

import useBodyClass from './hooks/useBodyClass';

// import AuthModal from './components/AuthModal';
import AppLoginCallback from './pages/LoginCallback';
import Header from './components/Header';
import Profile from './pages/Profile';
import RequireAuth from './components/RequireAuth';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import UserLinkCallback from './pages/UserLinkCallback';

// const oktaAuth = new Okta.Auth(config.authConfig.oidc);
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

	const excludePaths = ['/signin', '/login/callback', '/identities/callback'];
	const showHeader = !excludePaths.includes(pathname);

	return (
		<React.Suspense fallback={<LDS.Spinner variant='brand' />}>
			<Okta.Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri}>
				<Auth.Provider>
					<LDS.IconSettings iconPath='/assets/icons'>
						{showHeader && <Header />}
						<Routes>
							<Route path='/signin' element={<SignIn />} />
							<Route path='/login/callback' element={<AppLoginCallback />} />
							<Route path='/identities/callback' element={<UserLinkCallback />} />
							<Route path='' element={<RequireAuth />}>
								<Route path='id' element={<Profile />} />
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
