import { Auth, LDS, React } from '../../common';
import AccountCard from './AccountCard';

const Account = props => {
	const dispatch = Auth.useAuthDispatch();
	const { isLoadingUserProfile, isLoadingLinkProfile, user } = Auth.useAuthState();
	const { linkUser, unlinkUser } = Auth.useAuthActions();

	const handleAdd = provider => linkUser(dispatch, provider);
	const handleDisconnect = accountId => unlinkUser(dispatch, user.id, accountId);

	const { header, subtitle, type, credentials = [] } = props;

	const buttonLabel = type === 'email' ? 'Add Email' : 'Connect';

	const socialButtons = (
		<>
			<LDS.Button title='Facebook' label='Connect Facebook' onClick={() => handleAdd('facebook')} />
			<LDS.Button title='Google' label='Connect Google' onClick={() => handleAdd('google')} />
			<LDS.Button title='LinkedIn' label='Connect LinkedIn' onClick={() => handleAdd('linkedin')} />
			<LDS.Button title='Apple' label='Connect Apple' disabled />
		</>
	);

	return (
		<div className='slds-m-bottom_xx-large'>
			<h3 className='slds-text-title_caps slds-m-vertical_small'>{header}</h3>
			<p className='slds-m-vertical_small slds-text-title tds-color_meteorite'>{subtitle}</p>
			{(isLoadingUserProfile || isLoadingLinkProfile) && (
				<div>
					<LDS.Spinner containerStyle={{ opacity: 0.33 }} />
				</div>
			)}
			{!isLoadingUserProfile &&
				!isLoadingLinkProfile &&
				credentials.map(credential => (
					<AccountCard
						key={`${credential?.provider?.name}-${credential?.id}`}
						credential={credential}
						onDisconnect={handleDisconnect}
					/>
				))}
			{/* <AccountCard {...props} /> */}
			{type !== 'social' && <LDS.Button title={buttonLabel} label={buttonLabel} />}
			{type === 'social' && socialButtons}
		</div>
	);
};

export default Account;
