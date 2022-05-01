/* eslint-disable react-hooks/exhaustive-deps */
import { Auth, LDS, PropTypes, React } from '../../common';

import { IconButton, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import AuthDialog from './AuthDialog';

const ENV = process.env.NODE_ENV;
const OKTA_ORIGINS = ['https://id.salesf00rce.com', 'https://sfdc-tbid.oktapreview.com'];
const ALLOWED_ORIGINS_PROD = ['https://profile.salesf00rce.com', ...OKTA_ORIGINS];
const ALLOWED_ORIGINS_DEV = ['http://localhost:3000', ...OKTA_ORIGINS];
const ALLOWED_ORIGINS = ENV === 'production' ? ALLOWED_ORIGINS_PROD : ALLOWED_ORIGINS_DEV;
const IFRAME_ALLOW = `publickey-credentials-get ${ALLOWED_ORIGINS.join(' ')}`;

const AuthModal = props => {
	const { onClose } = props;
	const dispatch = Auth.useAuthDispatch();
	const {
		isVisibleAuthModal,
		isPendingAccountLink,
		isPendingAuthModalLoad,
		isVisibleIframe,
		authUrl,
	} = Auth.useAuthState();
	const { linkUser } = Auth.useAuthActions();

	const modalWidth = '400px';
	const modalHeight = '650px';

	const onCancel = () => {
		dispatch({ type: 'USER_LINK_MODAL_CANCELLED' });
		return onClose();
	};

	React.useEffect(() => {
		const responseHandler = ({ origin, data }) => {
			const isAllowed = ALLOWED_ORIGINS.includes(origin);

			if (!isAllowed) {
				return dispatch({
					type: 'USER_LINK_MODAL_FAILED',
					error: `'origin ${origin} is not allowed`,
				});
			}

			if (data?.code) {
				return linkUser(dispatch, { data, isModal: true });
			}

			if (data?.result === 'success') {
				return dispatch({ type: 'USER_LINK_MODAL_LOADED' });
			}
		};

		const resolve = error => {
			if (error) {
				throw error;
			}

			console.debug('removing listener...');
			window.removeEventListener('message', responseHandler);
		};

		if (isVisibleAuthModal) {
			console.debug('adding listener...');
			window.addEventListener('message', responseHandler);
		}

		return () => resolve();
	}, [isVisibleAuthModal]);

	return (
		<AuthDialog open={isVisibleAuthModal} onClose={onClose}>
			<DialogTitle>
				<IconButton
					edge='end'
					size='small'
					onClick={onCancel}
					sx={{
						color: 'white',
						position: 'absolute',
						borderRadius: 25,
						background: 'rgba(0, 0, 0, 0.53)',
						right: -15,
						top: -15,
						'z-index': '10000',
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ minWidth: modalWidth, minHeight: modalHeight }}>
				{isPendingAuthModalLoad && <LDS.Spinner />}
				{authUrl && isVisibleIframe && (
					<iframe
						src={authUrl}
						name='iframe-auth'
						title='Link Account'
						width={modalWidth}
						height={modalHeight}
						frameBorder='0'
						style={{ display: 'block', borderRadius: '4px' }}
						allow={IFRAME_ALLOW}
					/>
				)}
			</DialogContent>
		</AuthDialog>
	);
};

AuthModal.defaultProps = {
	open: false,
	onClose: () => {},
};

AuthModal.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool,
};

export default AuthModal;
