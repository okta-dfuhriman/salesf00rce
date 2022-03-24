import { Auth, Okta, React, LDS, config, useEffect } from './common';
import { Route, Switch, useLocation, useHistory } from 'react-router-dom';

import './styles/App.css';

import useBodyClass from './hooks/useBodyClass';
import Header from './components/Header';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const oktaAuth = new Okta.Auth(config.authConfig.oidc);

oktaAuth.start();

const App = () => {
	useBodyClass('tds-bg_sand');

	const { pathname } = useLocation();
	const history = useHistory();
	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		history.replace(Okta.toRelativeUrl(originalUri || '/', window.location.origin));
	const customAuthHandler = () => history.push('/');

	// Setting page scroll to 0 when changing the route
	useEffect(() => {
		document.documentElement.scrollTop = 0;

		if (document?.scrollingElement) {
			document.scrollingElement.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<Okta.Security
			oktaAuth={oktaAuth}
			restoreOriginalUri={restoreOriginalUri}
			onAuthRequired={customAuthHandler}
		>
			<Auth.Provider>
				<LDS.IconSettings iconPath='/assets/icons'>
					<Header />
					<Switch>
						<Route path='/id' exact component={Profile} />
						<Route path='/settings' exact component={Settings} />
						<Route path='*' component={Profile} />
					</Switch>
				</LDS.IconSettings>
			</Auth.Provider>
		</Okta.Security>
	);
};

export default App;
