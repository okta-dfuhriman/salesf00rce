import { React } from '../common';

const addBodyClass = className => document.body.classList.add(className);
const removeBodyClass = className => document.body.classList.remove(className);

export const useBodyClass = className => {
	React.useEffect(() => {
		className instanceof Array ? className.map(addBodyClass) : addBodyClass(className);

		return () => {
			className instanceof Array ? className.map(removeBodyClass) : removeBodyClass(className);
		};
	}, [className]);
};
