import { Auth, LDS, React } from '../../common';
import AccountCard from './AccountCard';

const Account = props => {
	const dispatch = Auth.useAuthDispatch();
	const { isLoadingUserProfile, isLoadingLinkProfile } = Auth.useAuthState();
	const { linkUser, unlinkUser } = Auth.useAuthActions();

	const handleAdd = provider => linkUser(dispatch, provider);
	const handleDisconnect = credential => unlinkUser(dispatch, credential);

	const { header, subtitle, type, credentials = [] } = props;

	const buildButtons = type => {
		let buttonLabel = 'Connect';
		let buttons = [];

		switch (type) {
			case 'email':
				buttonLabel = 'Add Email';
				buttons = [
					<LDS.Button title={buttonLabel} label={buttonLabel} onClick={() => handleAdd('email')} />,
				];
				break;
			case 'social':
				buttons = [
					<LDS.Button
						title='Facebook'
						label='Connect Facebook'
						onClick={() => handleAdd('facebook')}
					/>,
					<LDS.Button title='Google' label='Connect Google' onClick={() => handleAdd('google')} />,
					<LDS.Button
						title='LinkedIn'
						label='Connect LinkedIn'
						onClick={() => handleAdd('linkedin')}
					/>,
					<LDS.Button title='Apple' label='Connect Apple' disabled />,
				];
				break;
			case 'salesforce':
				buttons = [
					<LDS.Button
						title={buttonLabel}
						label={buttonLabel}
						onClick={() => handleAdd('salesforce')}
					/>,
				];
				break;
			default:
				buttons = [<LDS.Button title={buttonLabel} label={buttonLabel} disabled />];
		}

		return buttons;
	};

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
						onDisconnect={() => handleDisconnect(credential)}
					/>
				))}
			{buildButtons(type)}
		</div>
	);
};

export default Account;
