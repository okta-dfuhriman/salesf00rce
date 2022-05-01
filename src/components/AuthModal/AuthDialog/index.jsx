import { PropTypes } from '../../../common';
import MuiDialog from '@mui/material/Dialog';
import { styled } from '@mui/material/styles';

const style = {
	'& .MuiPaper-root': {
		padding: 'unset',
		overflowY: 'unset',
		margin: 0,
		background: 'white',
		'z-index': 6000,
	},
	'& .MuiDialog-root': {
		padding: 'unset',
		overflowY: 'unset',
		margin: 0,
	},
	'& .MuiDialogContent-root': {
		padding: 'unset',
		overflowY: 'unset',
	},
	'& .MuiDialogTitle-root': {
		padding: 'unset',
		overflowY: 'unset',
		margin: 0,
	},
};

const AuthDialog = styled(MuiDialog)(() => style);

AuthDialog.defaultProps = {
	open: false,
	onClose: () => {},
};

AuthDialog.propTypes = {
	onClose: PropTypes.func,
	open: PropTypes.bool,
};

export default AuthDialog;
