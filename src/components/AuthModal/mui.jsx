/* eslint-disable react-hooks/exhaustive-deps */
import { Dialog, DialogContent, DialogTitle, IconButton, useMediaQuery } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { styled, useTheme } from '@mui/material/styles';

import { Auth, React, LDS, PropTypes } from '../../common';

const ENV = process.env.NODE_ENV;
const ORIGINS = process.env.REACT_APP_ORIGIN_ALLOW?.split(' ') || [window.location.origin];
const ALLOW = process.env.REACT_APP_IFRAME_ALLOW;

const AuthDialogRoot = styled(Dialog)(({ theme }) => ({
	'& .MuiPaper-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
		background: 'white',
	},
	'& .MuiDialog-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
	},
	'& .MuiDialogContent-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
	},
	'& .MuiDialogTitle-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
	},
}));

const MuiAuthDialog = props => {
	const { onClose } = props;
	const dispatch = Auth.useAuthDispatch();
	const { login } = Auth.useAuthActions();
	const { authUrl, isVisibleAuthModal, isLoadingLogin, isVisibleAuthIframe, tokenParams } =
		Auth.useAuthState();

	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

	const modalWidth = '400px';
	const modalHeight = '650px';

	const onCancel = () => {
		dispatch({ type: 'LOGIN_CANCELLED' });
		return onClose();
	};

	React.useEffect(() => {
		if (isVisibleAuthModal) {
			login(dispatch);
		}
	}, [isVisibleAuthModal]);

	React.useEffect(() => {
		if (tokenParams?.authorizationCode) {
			return login(dispatch, { tokenParams });
		}
	}, [tokenParams]);

	React.useEffect(() => {
		const responseHandler = ({ origin, data }) => {
			if (ENV === 'production') {
				const isAllowed = ORIGINS.includes(origin);

				if (!isAllowed) {
					return dispatch({
						type: 'LOGIN_ERROR',
						payload: { isVisibleAuthIframe: false, isVisibleAuthModal: false },
						error: `'origin' [${origin}] not allowed`,
					});
				}
			}

			if (data?.type === 'onload' && data?.result === 'success') {
				return dispatch({
					type: 'LOGIN_PENDING',
					payload: { isVisibleAuthIframe: true, isVisibleAuthModal: true, isLoadingLogin: false },
				});
			}

			if (data?.code) {
				dispatch({
					type: 'LOGIN_PENDING',
					payload: {
						tokenParams: {
							...tokenParams,
							authorizationCode: data?.code,
							interactionCode: data?.interaction_code,
						},
						isVisibleAuthIframe: false,
						isVisibleAuthModal: false,
						isLoadingLogin: true,
					},
				});
			}
		};

		const resolve = error => {
			if (error) {
				throw error;
			}

			window.removeEventListener('message', responseHandler);
		};

		if (isVisibleAuthModal) {
			window.addEventListener('message', responseHandler);
		}

		return () => resolve();
	}, [isVisibleAuthModal]);

	return (
		<AuthDialogRoot fullScreen={fullScreen} open={isVisibleAuthModal ?? false} onClose={onClose}>
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
						'z-index': 10000,
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ width: modalWidth, height: modalHeight }}>
				{isLoadingLogin && <LDS.Spinner variant='brand' size='large' />}
				{authUrl && isVisibleAuthIframe && (
					<iframe
						src={authUrl}
						name='iframe-auth'
						title='Sign In'
						width={modalWidth}
						height={modalHeight}
						frameBorder='0'
						style={{ display: 'block', borderRadius: '4px' }}
						allow={ALLOW}
					/>
				)}
			</DialogContent>
		</AuthDialogRoot>
	);
};

MuiAuthDialog.propTypes = {
	onClose: PropTypes.func,
};

export default MuiAuthDialog;
