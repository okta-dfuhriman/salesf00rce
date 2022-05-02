const VERCEL_GIT_COMMIT_REF = process.env.VERCEL_GIT_COMMIT_REF;
const ENV = process.env.VERCEL_ENV;
const PROJECT_BRANCH = process.env.PROJECT_BRANCH;

(() => {
	const passIcon = '✅';
	const passMsg = 'can proceed';
	const skipIcon = '🛑';
	const skipMsg = 'skipped';

	const result =
		ENV === 'production' || (VERCEL_GIT_COMMIT_REF && VERCEL_GIT_COMMIT_REF === PROJECT_BRANCH);
	const resultIcon = result ? passIcon : skipIcon;
	const msg = result ? passMsg : skipMsg;

	console.log(`${resultIcon} - Build for ${ENV} ${msg}.`);
	console.log(`${resultIcon} - Build branch: ${VERCEL_GIT_COMMIT_REF}.`);
	console.log(`${resultIcon} - Project branch: ${PROJECT_BRANCH}.`);

	if (result) {
		return 1;
	}

	return 0;
})();
