import { Auth, LDS, Link } from '../../common';

import DropdownCard from '../DropdownCard';

const Header = () => {
	const { isLoadingProfile, user } = Auth.useAuthState();

	const displayName =
		user?.nickname || user?.name || `${user?.given_name} ${user?.family_name}` || '';

	const userPanel =
		isLoadingProfile || !user ? (
			<div style={{ width: '8rem', height: '3rem' }}>
				<LDS.Spinner
					variant='brand'
					size='small'
					containerClassName='slds-align_absolute-center slds-p-around_large '
					containerStyle={{ left: 'unset', right: 'unset' }}
				/>
			</div>
		) : (
			<>
				<div className='tds-text-size_3 tds-text_bold slds-text-align_right slds-m-right_small slds-truncate'>
					{displayName}
				</div>
				<div className='slds-m-right_small'>
					<LDS.Dropdown
						className='header-dropdown'
						align='right'
						width='small'
						menuStyle={{ width: '16rem' }}
					>
						<DropdownCard />
						<LDS.DropdownTrigger>
							<LDS.Button variant='base' className='tds-avatar'>
								<LDS.Avatar
									imgSrc={user?.picture ?? '/assets/images/astro.svg'}
									imgAlt={displayName}
									size='large'
								/>
							</LDS.Button>
						</LDS.DropdownTrigger>
					</LDS.Dropdown>
				</div>
			</>
		);

	return (
		<div
			className='tds-desktop-header tds-bg_white slds-show__medium slds-show_medium'
			style={{
				borderBottom: '3px solid rgb(0, 112, 210)',
				position: 'sticky',
				top: 0,
				zIndex: 10,
			}}
		>
			<div className='slds-grid slds-container_x-large slds-container_center slds-p-horizontal_small'>
				<div className='slds-p-vertical_small slds-p-horizontal_medium slds-grid slds-grid_align-spread slds-grow slds-grid_vertical-align-center'>
					<Link to='/'>
						<img alt='Trailblazer.me' src='/assets/images/trailblazer-me.svg' />
					</Link>
				</div>
				<div className='slds-grid slds-grid_vertical-align-center slds-p-around_x-small'>
					<div className='slds-p-right_large slds-m-right_large border'>
						<LDS.AppLauncher
							id='app-launcher-tigger'
							modalHeaderButton={<LDS.Button label='App Exchange' />}
						>
							<LDS.AppLauncherExpandableSection title='Tile Section' />
						</LDS.AppLauncher>
					</div>
					{userPanel}
				</div>
			</div>
		</div>
	);
};

export default Header;
