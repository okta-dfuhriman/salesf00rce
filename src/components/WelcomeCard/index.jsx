import { _, Icons, LDS, Queries, ReactQuery, Utils } from '../../common';

const WelcomeCard = () => {
	const isPendingAccountLink = ReactQuery.useIsMutating('account-link') > 0;

	const { data: userInfo } = Queries.useUserInfoQuery();
	const { isLoading: isLoadingUserProfile, data: user } = Queries.useUserProfileQuery({
		userInfo,
	});

	const { profile, credentials } = user || {};

	const currentAccounts = credentials?.filter(({ isLoggedIn }) => isLoggedIn) || [];

	const currentAccount =
		currentAccounts?.length > 1
			? currentAccounts?.filter(
					({ provider: { type } }) => type !== 'email' && type !== 'password'
			  )[0]
			: currentAccounts[0] || [];

	let providerIcon;

	const { login, provider } = currentAccount || {};

	const providerName = provider?.name || '';

	switch (providerName) {
		case 'apple':
			providerIcon = <Icons.Apple.Round className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'facebook':
			providerIcon = <Icons.Facebook.Round className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'google':
			providerIcon = <Icons.Google.Round className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'linkedin':
			providerIcon = <Icons.LinkedIn.Round className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'salesforce':
			providerIcon = <Icons.Salesforce.Round className='tds-icon-social slds-icon_small' />;
			break;
		case 'email':
			providerIcon = <Icons.Email.Round className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		default:
			providerIcon = <></>;
			break;
	}

	const cardBody = (
		<>
			{(isPendingAccountLink || isLoadingUserProfile) && (
				<div>
					<LDS.Spinner />
				</div>
			)}
			<div>
				Hey {Utils.getUserName(userInfo, profile)}! You're logged in with your{' '}
				{_.capitalize(providerName)} account:&nbsp;&nbsp;
				<span className='tds-text_bold break-word'>
					{providerIcon} {login}.
				</span>
			</div>
		</>
	);
	const cardHeader = (
		<LDS.MediaObject
			verticalCenter
			body={cardBody}
			figure={
				<LDS.Avatar
					imgSrc={Utils.getProfilePicture(userInfo, profile)}
					imgAlt={Utils.getUserName(userInfo, profile) ?? 'user avatar'}
					size='large'
				/>
			}
		/>
	);

	return (
		<LDS.Card
			id='welcome-card'
			key='welcome-card'
			className='tds-card'
			bodyClassName='slds-card__body_inner'
			header={cardHeader}
		/>
	);
};

export default WelcomeCard;
