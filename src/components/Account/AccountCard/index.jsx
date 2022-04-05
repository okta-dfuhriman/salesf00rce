import {
	LDS,
	React,
	AppleIconRound,
	EmailIconRound,
	FacebookIconRound,
	GoogleIconRound,
	LinkedInIconRound,
	SalesforceIconRound,
} from '../../../common';

const provider2IdpMap = {
	google: 'Google',
	linkedin: 'LinkedIn',
	apple: 'Apple',
	salesforce: 'Salesforce',
	facebook: 'Facebook',
};

const AccountCardBody = ({ username, provider }) => (
	<>
		<div className='tds-line-height_small'>
			<strong className='break-word'>
				{provider === 'email'
					? username
					: `Connected to ${provider2IdpMap[provider]} as ${username}`}
			</strong>
		</div>
		{provider === 'salesforce' && (
			<dl className='slds-dl_horizontal tds-text-size_4'>
				<dt className='slds-dl_horizontal__label'>Email:</dt>
				<dd className='slds-dl_horizontal__detail'>{username}</dd>
				<dt className='slds-dl_horizontal__label'>Type:</dt>
				<dd className='slds-dl_horizontal__detail'>Developer Edition</dd>
				<dt className='slds-dl_horizontal__label'>Active user:</dt>
				<dd className='slds-dl_horizontal__detail'>Yes</dd>
			</dl>
		)}
	</>
);

const AccountCard = props => {
	const { account, onDisconnect } = props;
	const { id, provider, login } = account;

	const isLoggedIn = true;

	let providerIcon;

	switch (provider) {
		case 'apple':
			providerIcon = <AppleIconRound className='slds-icon tds-icon-social slds-icon_large' />;
			break;
		case 'facebook':
			providerIcon = <FacebookIconRound className='slds-icon tds-icon-social slds-icon_large' />;
			break;
		case 'google':
			providerIcon = <GoogleIconRound className='slds-icon tds-icon-social slds-icon_large' />;
			break;
		case 'linkedin':
			providerIcon = <LinkedInIconRound className='slds-icon tds-icon-social slds-icon_large' />;
			break;
		default:
			providerIcon = <EmailIconRound className='slds-icon tds-icon-social slds-icon_large' />;
	}

	return (
		<div
			className='slds-p-around_medium slds-m-vertical_small action-item'
			id={`${provider}-${id}`}
		>
			<LDS.IconSettings iconPath='/assets/icons'>
				<div
					className={
						provider === 'salesforce'
							? 'slds-media slds-media_top tds-media slds-grid_vertical-align-top'
							: 'slds-media slds-media_center slds-grid_vertical-align-center'
					}
				>
					<div className='slds-media__figure'>
						<span className='slds-icon__container'>{providerIcon}</span>
					</div>
					<div className='slds-media__body'>
						<AccountCardBody username={login} provider={provider} />
					</div>
					<div className='slds-no-flex'>
						<LDS.Button
							disabled={isLoggedIn}
							label='Disconnect'
							variant={isLoggedIn ? 'brand' : 'destructive'}
							onClick={() => onDisconnect(id)}
						/>
					</div>
				</div>
			</LDS.IconSettings>
		</div>
	);
};

export default AccountCard;
