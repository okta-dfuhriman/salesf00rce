import { Auth, LDS, Link } from '../../common';

import './styles.css';

const DropdownCard = () => {
	const dispatch = Auth.useAuthDispatch();
	const { logout } = Auth.useAuthActions();
	const { user } = Auth.useAuthState();

	const displayName = user?.name ?? `${user?.given_name} ${user?.family_name}` ?? '';

	return (
		<div className='slds-text-align_left' id='dropdown-profile'>
			<img src='assets/images/arid-dunes.png' className='background' alt='arid-dunes' />
			<div className='slds-m-bottom_xx-small slds-p-horizontal_large'>
				<img
					className='avatar'
					src={user?.picture ?? '/assets/images/astro.svg'}
					alt={displayName}
				/>
			</div>
			<div className='slds-p-horizontal_large slds-p-bottom_medium'>
				<div
					className='slds-text-heading_medium slds-m-bottom_medium text-wrap'
					title={displayName}
				>
					{displayName}
				</div>
				<ul>
					<li>
						<Link to='/id' className='slds-text-body_regular'>
							Profile
						</Link>
					</li>
					<li>
						<Link to='/settings' className='slds-text-body_regular'>
							Settings
						</Link>
					</li>
				</ul>
			</div>
			<div className='slds-text-body_regular slds-p-horizontal_large slds-p-vertical_medium logout'>
				<LDS.Button variant='base' label='Logout' onClick={() => logout(dispatch)} />
			</div>
		</div>
	);
};

export default DropdownCard;
