const VERCEL_GIT_COMMIT_REF = process.env.VERCEL_GIT_COMMIT_REF;
const ENV = process.env.VERCEL_ENV;
const PROJECT_BRANCH = process.env.PROJECT_BRANCH;

(() => {
	const pass = ENV === 'production' || VERCEL_GIT_COMMIT_REF === PROJECT_BRANCH || false;
	const passIcon = '✅';
	const passMsg = 'can proceed';
	const skipIcon = '🛑';
	const skipMsg = 'skipped';

	const result = pass ? 1 : 0;
	const resultIcon = pass ? passIcon : skipIcon;
	const msg = pass ? passMsg : skipMsg;

	console.log('result:', result);
	console.log(`${resultIcon} - Build for ${ENV} ${msg}.`);
	console.log(`${resultIcon} - Build branch: ${VERCEL_GIT_COMMIT_REF}.`);
	console.log(`${resultIcon} - Project branch: ${PROJECT_BRANCH}.`);

	return result;
})();
