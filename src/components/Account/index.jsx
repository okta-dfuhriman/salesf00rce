import { Auth, LDS, React, useUserProfileQuery } from '../../common';
import AccountCard from './AccountCard';

const Account = props => {
	const dispatch = Auth.useAuthDispatch();
	const { isLoading: isLoadingUserProfile } = useUserProfileQuery({ dispatch });

	const { isPendingAccountLink } = Auth.useAuthState();
	const { linkUser, unlinkUser } = Auth.useAuthActions();

	const handleAdd = provider => linkUser(dispatch, { idp: provider });
	const handleDisconnect = credential => unlinkUser(dispatch, credential);

	const { header, subtitle, type, credentials = [] } = props;

	const buildButtons = type => {
		let buttonLabel = 'Connect';
		let buttons = [];

		switch (type) {
			case 'email':
				buttonLabel = 'Add Email';
				buttons = [
					<LDS.Button
						id={`${type}-add-button`}
						key={`${type}-add-button`}
						title={buttonLabel}
						label={buttonLabel}
						onClick={() => handleAdd('email')}
					/>,
				];
				break;
			case 'social':
				buttons = [
					<LDS.Button
						id={'facebook-add-button'}
						key={'facebook-add-button'}
						title='Facebook'
						label='Connect Facebook'
						onClick={() => handleAdd('facebook')}
					/>,
					<LDS.Button
						id={'google-add-button'}
						key={'google-add-button'}
						title='Google'
						label='Connect Google'
						onClick={() => handleAdd('google')}
					/>,
					<LDS.Button
						id={'linkedin-add-button'}
						key={'linkedin-add-button'}
						title='LinkedIn'
						label='Connect LinkedIn'
						onClick={() => handleAdd('linkedin')}
					/>,
					<LDS.Button
						id={'apple-add-button'}
						key={'apple-add-button'}
						title='Apple'
						label='Connect Apple'
						disabled
					/>,
				];
				break;
			case 'salesforce':
				buttons = [
					<LDS.Button
						id={'salesforce-add-button'}
						key={'salesforce-add-button'}
						title={buttonLabel}
						label={buttonLabel}
						onClick={() => handleAdd('salesforce')}
					/>,
				];
				break;
			default:
				buttons = [
					<LDS.Button
						id={'default-add-button'}
						key={'default-add-button'}
						title={buttonLabel}
						label={buttonLabel}
						disabled
					/>,
				];
		}

		return buttons;
	};

	return (
		<div className='slds-m-bottom_xx-large'>
			<h3 className='slds-text-title_caps slds-m-vertical_small'>{header}</h3>
			<p className='slds-m-vertical_small slds-text-title tds-color_meteorite'>{subtitle}</p>
			{(isPendingAccountLink || isLoadingUserProfile) && (
				<div>
					<LDS.Spinner containerStyle={{ opacity: 0.4 }} />
				</div>
			)}
			{credentials.map(credential => (
				<AccountCard
					id={`${credential?.provider?.name}-${credential?.id}`}
					key={`${credential?.provider?.name}-${credential?.id}`}
					credential={credential}
					onDisconnect={() => handleDisconnect(credential)}
					type={type}
				/>
			))}
			{buildButtons(type)}
		</div>
	);
};

export default Account;
