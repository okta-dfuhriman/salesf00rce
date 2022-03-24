import {
	AppLauncher,
	AppLauncherExpandableSection,
	Avatar,
	Button,
	Dropdown,
	DropdownTrigger,
	GlobalNavigationBar,
	GlobalNavigationBarRegion,
} from '@salesforce/design-system-react';

const Header = () => (
	<div
		className='tds-desktop-header tds-bg_white slds-show__medium slds-show_medium'
		style={{ borderBottom: '3px solid rgb(0, 112, 210)', position: 'sticky', top: 0, zIndex: 10 }}
	>
		<div className='slds-grid slds-container_x-large slds-container_center slds-p-horizontal_small'>
			<div className='slds-p-vertical_small slds-p-horizontal_medium slds-grid slds-grid_align-spread slds-grow slds-grid_vertical-align-center'>
				<a href='/'>
					<img alt='Trailblazer.me' src='/assets/images/trailblazer-me.svg' />
				</a>
			</div>
			<div className='slds-grid slds-grid_vertical-align-center slds-p-around_x-small'>
				<div className='slds-p-right_large slds-m-right_large border'>
					<AppLauncher id='app-launcher-tigger' modalHeaderButton={<Button label='App Exchange' />}>
						<AppLauncherExpandableSection title='Tile Section' />
					</AppLauncher>
				</div>
				<div className='tds-text-size_3 tds-text_bold slds-text-align_right slds-m-right_small slds-truncate'>
					Danny Fuhriman
				</div>
				<div className='slds-m-right_small'>
					<Dropdown>
						<DropdownTrigger>
							<Button variant='base' className='tds-avatar'>
								<Avatar imgSrc='/assets/images/astro.svg' imgAlt='Danny Fuhriman' />
							</Button>
						</DropdownTrigger>
					</Dropdown>
				</div>
			</div>
		</div>
	</div>
);

export default Header;
