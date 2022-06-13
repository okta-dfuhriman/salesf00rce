import { Auth, Images, React, ReactQuery, ReactRouter } from '../../common';

import AppLauncher from '../AppLauncher';
import UserMenu from '../UserMenu';

const Header = () => {
	const isPendingLogout = ReactQuery.useIsMutating('logout') > 0;
	const { isAuthenticated } = Auth.useAuthState();

	return (
		<div
			id='nav-bar'
			className='tds-desktop-header tds-bg_white slds-show__medium slds-show_medium'
			style={{
				borderBottom: '3px solid rgb(0, 112, 210)',
				position: 'sticky',
				top: 0,
				zIndex: 5000,
			}}
		>
			<div
				id='nav-container'
				className='slds-grid slds-container_x-large slds-container_center slds-p-horizontal_small'
			>
				<div
					id='logo'
					className='slds-p-vertical_small slds-p-horizontal_medium slds-grid slds-grid_align-spread slds-grow slds-grid_vertical-align-center'
				>
					<ReactRouter.Link to='/'>
						<Images.TrailblazerLogo />
					</ReactRouter.Link>
				</div>
				<div className='slds-grid slds-grid_vertical-align-center slds-p-around_x-small'>
					{(isAuthenticated || isPendingLogout) && (
						<>
							<div className='slds-p-right_large slds-m-right_large border'>
								<AppLauncher />
							</div>
							<UserMenu />
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Header;
