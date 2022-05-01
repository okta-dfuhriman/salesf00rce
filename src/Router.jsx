/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, Okta, React } from './common';
import { Routes, Route } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import SecureApp from './components/SecureApp';
import HomePage from './pages/Home';
import TodayPage from './pages/Today';

const Router = () => {
	const { oktaAuth } = Okta.useOktaAuth();
	const dispatch = Auth.useAuthDispatch();

	React.useEffect(() => {
		oktaAuth.authStateManager.subscribe(() => dispatch({ type: 'AUTH_STATE_UPDATED' }));

		return () => oktaAuth.authStateManager.unsubscribe();
	}, []);

	return (
		<Routes>
			<Route path='/login/callback' element={<AppLoginCallback />} />
			<Route path='/' element={<HomePage />} />
			<Route element={<SecureApp />}>
				<Route path='/today' element={<TodayPage />} />
			</Route>
		</Routes>
	);
};

export default Router;
