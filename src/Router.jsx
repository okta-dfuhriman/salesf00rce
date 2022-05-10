import { Auth } from './common';
import { Routes, Route } from 'react-router-dom';

import AppLoginCallback from './pages/LoginCallback';
import Header from './components/Header';
import PageSpinner from './components/PageSpinner';
import Profile from './pages/Profile';
import SecureApp from './components/SecureApp';
import Settings from './pages/Settings';
import UserLinkCallback from './pages/UserLinkCallback';

const Router = () => {
	const { isLoading } = Auth.useAuthState();

	return (
		<>
			<Routes>
				<Route path='/login/callback' element={<AppLoginCallback />} />
				<Route path='/identities/callback' element={<UserLinkCallback />} />
				<Route element={<SecureApp header={<Header />} />}>
					<Route path='/' element={!isLoading ? <Profile /> : <PageSpinner />} />
					<Route path='settings' element={!isLoading ? <Settings /> : <PageSpinner />} />
				</Route>
			</Routes>
		</>
	);
};

export default Router;
