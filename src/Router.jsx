/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Okta, React } from './common';
import { Routes, Route } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import Profile from './pages/Profile';
import SecureApp from './components/SecureApp';
import Settings from './pages/Settings';
import SignIn from './pages/SignIn';
import UserLinkCallback from './pages/UserLinkCallback';

const Router = () => {
	const { oktaAuth } = Okta.useOktaAuth();
	const dispatch = Auth.useAuthDispatch();

	React.useEffect(() => {
		oktaAuth.authStateManager.subscribe(() => dispatch({ type: 'AUTH_STATE_UPDATED' }));

		return () => oktaAuth.authStateManager.unsubscribe();
	}, []);

	return (
		<Routes>
			<Route path='/signin' element={<SignIn />} />
			<Route path='/login/callback' element={<AppLoginCallback />} />
			<Route path='/identities/callback' element={<UserLinkCallback />} />
			<Route element={<SecureApp />}>
				<Route path='/' element={<Profile />} />
				<Route path='settings' element={<Settings />} />
			</Route>
		</Routes>
	);
};

export default Router;
