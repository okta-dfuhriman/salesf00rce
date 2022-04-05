import { useLockBodyScroll, LDS } from '../../common';
const PageSpinner = props => {
	useLockBodyScroll();
	return <LDS.Spinner {...props} />;
};

export default PageSpinner;
