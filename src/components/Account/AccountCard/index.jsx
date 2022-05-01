import {
	Auth,
	LDS,
	React,
	AppleIconRound,
	EmailIconRound,
	FacebookIconRound,
	GoogleIconRound,
	LinkedInIconRound,
	SalesforceIconRound,
} from '../../../common';

import './styles.css';

const provider2IdpMap = {
	google: 'Google',
	linkedin: 'LinkedIn',
	apple: 'Apple',
	salesforce: 'Salesforce',
	facebook: 'Facebook',
};

const AccountCardBody = ({ login, providerName, type: providerType }) => (
	<>
		<div className='tds-line-height_small'>
			<strong className='break-word'>
				{providerType !== 'social'
					? login
					: `Connected to ${provider2IdpMap[providerName]} as ${login}`}
			</strong>
		</div>
		{providerName === 'salesforce' && (
			<dl className='slds-dl_horizontal tds-text-size_4'>
				<dt className='slds-dl_horizontal__label'>Email:</dt>
				<dd className='slds-dl_horizontal__detail'>{login}</dd>
				<dt className='slds-dl_horizontal__label'>Type:</dt>
				<dd className='slds-dl_horizontal__detail'>Developer Edition</dd>
				<dt className='slds-dl_horizontal__label'>Active user:</dt>
				<dd className='slds-dl_horizontal__detail'>Yes</dd>
			</dl>
		)}
	</>
);

const AccountCard = props => {
	const { isPendingAccountLink, isPendingUserFetch } = Auth.useAuthState();
	const [isLoading, setIsLoading] = React.useState(false);
	const { id, credential, onDisconnect, type } = props;
	const {
		id: userId,
		provider: { name: providerName },
		login,
		isLoggedIn,
	} = credential;

	if (providerName === 'password') {
		return null;
	}

	const disconnect = () => {
		setIsLoading(() => true);
		return onDisconnect(credential);
	};

	let providerIcon;

	switch (providerName) {
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
		case 'salesforce':
			providerIcon = <SalesforceIconRound className='tds-icon-social slds-icon_large' />;
			break;
		default:
			providerIcon = <EmailIconRound className='slds-icon tds-icon-social slds-icon_large' />;
	}

	return (
		<div
			id={id}
			className='slds-p-around_medium slds-m-vertical_small action-item'
			style={{ position: isLoading ? 'relative' : 'static' }}
		>
			{isLoading && <LDS.Spinner />}
			<LDS.IconSettings iconPath='/assets/icons'>
				<div
					className={
						providerName === 'salesforce'
							? 'slds-media slds-media_top tds-media slds-grid_vertical-align-top'
							: 'slds-media slds-media_center slds-grid_vertical-align-center'
					}
				>
					<div className='slds-media__figure'>
						<span className='slds-icon__container'>{providerIcon}</span>
					</div>
					<div className='slds-media__body'>
						<AccountCardBody login={login} providerName={providerName} type={type} />
					</div>
					<div className='slds-no-flex'>
						<LDS.Button
							id={`${providerName}-${userId}-disconnect`}
							disabled={isLoggedIn || isPendingAccountLink || isPendingUserFetch}
							label='Disconnect'
							variant='destructive'
							onClick={disconnect}
							className='tds-button_destructive-inverse'
							style={{ fontSize: '14px' }}
						/>
					</div>
				</div>
			</LDS.IconSettings>
		</div>
	);
};

export default AccountCard;
