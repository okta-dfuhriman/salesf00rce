import { Auth, ReactRouter } from './common';

import { Header, SecureApp } from './components';
import AppLoginCallback from './pages/AppLoginCallback';
import Loading from './pages/Loading';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import UserLinkCallback from './pages/UserLinkCallback';

const Router = () => {
	const { isLoading } = Auth.useAuthState();

	return (
		<>
			<ReactRouter.Routes>
				<ReactRouter.Route path='/login/callback' element={<AppLoginCallback />} />
				<ReactRouter.Route path='/identities/callback' element={<UserLinkCallback />} />
				<ReactRouter.Route element={<SecureApp header={<Header />} />}>
					<ReactRouter.Route path='/' element={!isLoading ? <Profile /> : <Loading />} />
					<ReactRouter.Route path='settings' element={!isLoading ? <Settings /> : <Loading />} />
				</ReactRouter.Route>
			</ReactRouter.Routes>
		</>
	);
};

export default Router;
