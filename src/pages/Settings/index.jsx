import { _, Auth, LDS, React, useState } from '../../common';

import SettingsCard from '../../components/SettingsCard';
import Providers from '../../components/Providers';
import AddressForm from '../../components/AddressForm';

import './styles.css';

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

const Settings = () => {
	const ref = React.useRef(null);

	const [selectedItem, setSelectedItem] = useState('privacy');

	const handleSelect = (event, { item }) => {
		setSelectedItem(() => item?.id);
		ref.current = document.getElementById(_.snakeCase(item?.id));
		ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
	};
	return (
		<>
			<div id='settings-page' className='slds-container_x-large slds-container_center'>
				<h1 className='slds-text-heading_large slds-p-left_large slds-p-top_large'>Settings</h1>
				<div className='slds-grid slds-p-around_large slds-wrap grid'>
					<div className='slds-col slds-large-size_1-of-5 slds-is-relative nav-col slds-p-right_large'>
						<div className='tds-is-sticky nav'>
							<LDS.Card
								id='nav-card'
								hasNoHeader
								className='tds-card tds-card_flush'
								bodyClassName='slds-card__body_inner'
								style={{ position: 'sticky' }}
							>
								<LDS.VerticalNavigation
									id='settings-nav'
									categories={menuItems}
									hasNoHeader
									selectedId={selectedItem}
									onSelect={handleSelect}
								/>
							</LDS.Card>
						</div>
					</div>
					<div className='slds-col slds-size_1-of-1 slds-large-size_4-of-5'>
						{/* welcome card */}
						<SettingsCard
							header='Privacy'
							subheader='Choose how others see your profile.'
							content={
								<LDS.Checkbox
									labels={{ label: 'Public Profile' }}
									id='public-profile-toggle'
									variant='toggle'
								/>
							}
						/>
						<SettingsCard
							header='Connected Accounts'
							subheader='You can log in using verified emails, Salesforce accounts, or your social media accounts.'
							content={<Providers />}
						/>
						<SettingsCard
							header='Email Preferences'
							subheader='Get email updates from Salesforce-related sites about ne content, replies to community posts, and more. To stop receiving email updates, manage your notification choices here.'
							content={'{{insert preferences}}'}
						/>
						<SettingsCard
							header='My Address'
							subheader={
								<p>
									We use your street address to send you physical mail. Private fields, marked with{' '}
									<LDS.Icon name='lock' category='utility' size='x-small' />, are visible only to
									you and Salesforce. Public fields, marked with{' '}
									<LDS.Icon name='world' category='utility' size='x-small' />, are visible to anyone
									who views your profile if you enabled the public profile setting.
								</p>
							}
							content={
								<>
									<AddressForm />
									<LDS.Button label='Cancel' />
									<LDS.Button label='Save' />
								</>
							}
						/>
						<SettingsCard
							header='Account Deletion'
							subheader={
								<>
									To delete your account, see{' '}
									<a href='https%3A%2F%2Fhelp.salesforce.com%2FarticleView%3FsiteLang%3Den%26id%3Dtbid_delete_account_considerations.htm'>
										Considerations for Deleting Your Trailblazer.me Account
									</a>
								</>
							}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Settings;
