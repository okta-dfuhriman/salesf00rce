import { Card, VerticalNavigation } from '@salesforce/design-system-react';

const VerticalNav = () => {
	const menuItems = [
		{
			id: 'menu',
			items: [
				{
					id: 'privacy',
					label: 'Privacy',
				},
				{
					id: 'connected-accounts',
					label: 'Connected Accounts',
				},
				{
					id: 'email-preferences',
					label: 'Email Preferences',
				},
				{
					id: 'my-address',
					label: 'My Address',
				},
				{
					id: 'account-deletion',
					label: 'Account Deletion',
				},
			],
		},
	];

	return <VerticalNavigation id='settings-nav' categories={menuItems} hasNoHeader />;
};

const NavCard = () => (
	<Card
		id='nav-card'
		hasNoHeader
		className='tds-card tds-card_flush'
		bodyClassName='slds-card__body_inner'
	>
		<VerticalNav />
	</Card>
);

export default NavCard;
