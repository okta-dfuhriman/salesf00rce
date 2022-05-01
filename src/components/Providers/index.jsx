import { Auth, React } from '../../common';

import Account from '../../components/Account';

const Providers = () => {
	const { credentials = [] } = Auth.useAuthState();

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
				type='salesforce'
				credentials={
					credentials?.length > 0
						? credentials.filter(
								({ provider: { name: providerName } }) => providerName === 'salesforce'
						  )
						: []
				}
			/>
			<Account
				header='Email Accounts'
				subtitle='Manage your connected email accounts.'
				type='email'
				credentials={
					credentials?.length > 0
						? credentials.filter(({ provider: { name: providerName } }) => providerName === 'email')
						: []
				}
			/>
			<Account
				header='Social Accounts'
				subtitle="Log in with your favorite social media accounts. Don't worry-we won't share your data or post anything on your behalf."
				type='social'
				credentials={
					credentials?.length > 0
						? credentials.filter(
								({ provider: { name: providerName } }) =>
									providerName !== 'email' && providerName !== 'salesforce'
						  )
						: []
				}
			/>
		</>
	);
};

export default Providers;
