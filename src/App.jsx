import { Route, Switch, useHistory } from 'react-router-dom';

import './styles/App.css';
import { IconSettings } from '@salesforce/design-system-react';

import useBodyClass from './hooks/useBodyClass';
import Header from './components/Header';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

const App = () => {
	useBodyClass('tds-bg_sand');

	return (
		<IconSettings iconPath='/assets/icons'>
			<Header />
			{/* <Switch> */}
			{/* <Route path='/id' exact component={Profile} />
				<Route path='/settings' exact component={Settings} />
				{/* <Route path='*' component={Profile} /> */}
			{/* </Switch> */}
			{/* <Profile /> */}
		</IconSettings>
	);
};

export default App;
