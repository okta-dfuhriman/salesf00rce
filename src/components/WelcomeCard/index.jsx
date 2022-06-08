import {
	_,
	Auth,
	getUserName,
	LDS,
	ReactQuery,
	AppleIconRound,
	EmailIconRound,
	FacebookIconRound,
	GoogleIconRound,
	LinkedInIconRound,
	SalesforceIconRound,
	getProfilePicture,
	useUserProfileQuery,
	useUserInfoQuery,
} from '../../common';

const WelcomeCard = () => {
	const dispatch = Auth.useAuthDispatch();
	const isPendingAccountLink = ReactQuery.useIsMutating('account-link') > 0;

	const { data: userInfo } = useUserInfoQuery(dispatch);
	const { isLoading: isLoadingUserProfile, data: user } = useUserProfileQuery({
		dispatch,
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
			providerIcon = <AppleIconRound className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'facebook':
			providerIcon = <FacebookIconRound className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'google':
			providerIcon = <GoogleIconRound className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'linkedin':
			providerIcon = <LinkedInIconRound className='slds-icon tds-icon-social slds-icon_small' />;
			break;
		case 'salesforce':
			providerIcon = <SalesforceIconRound className='tds-icon-social slds-icon_small' />;
			break;
		case 'email':
			providerIcon = <EmailIconRound className='slds-icon tds-icon-social slds-icon_small' />;
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
				Hey {getUserName(userInfo, profile)}! You're logged in with your{' '}
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
					imgSrc={getProfilePicture(userInfo, profile)}
					imgAlt={getUserName(userInfo, profile) ?? 'user avatar'}
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
