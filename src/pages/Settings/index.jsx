import VerticalNav from '../../components/VerticalNav';
import SettingsCard from '../../components/SettingsCard';
import Account from '../../components/Account';
import AddressForm from '../../components/AddressForm';
import { LDS } from '../../common';

const Providers = () => {
	return (
		<>
			<Account
				header='Salesforce Accounts'
				subtitle={
					<>
						Connect your Salesforce login from any production org, Developer Edition org, or
						Trailhead Playground. Learn more about{' '}
						<a href='https://help.salesforce.com/articleView?id=tbid_account_merges.htm'>
							merging your accounts.
						</a>
					</>
				}
				provider='salesforce'
			/>
			<Account
				header='Email Accounts'
				subtitle='Manage your connected email accounts.'
				provider='email'
			/>
			<Account
				header='Social Accounts'
				subtitle="Log in with your favorite social media accounts. Don't worry-we won't share your data or post anything on your behalf."
				provider='social'
			/>
		</>
	);
};

const Settings = () => (
	<div className='slds-container_x-large slds-container_center'>
		<h1 className='slds-text-heading_large slds-p-left_large slds-p-top_large'>Settings</h1>
		<div className='slds-grid slds-p-around_large slds-wrap grid'>
			<div className='slds-col slds-large-size_1-of-5 slds-is-relative nav-col slds-p-right_large'>
				<div className='tds-is-sticky nav'>
					<VerticalNav />
				</div>
			</div>
			<div className='slds-col slds-size_1-of-1 slds-large-size_4-of-5'>
				{/* welcome card */}
				<SettingsCard
					header='Privacy'
					subheader='Choose how others see your profile.'
					content='{{insert switch here}}'
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
							<LDS.Icon name='lock' category='utility' size='x-small' />, are visible only to you
							and Salesforce. Public fields, marked with{' '}
							<LDS.Icon name='world' category='utility' size='x-small' />, are visible to anyone who
							views your profile if you enabled the public profile setting.
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
);

export default Settings;
