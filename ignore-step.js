const VERCEL_GIT_COMMIT_REF = process.env.VERCEL_GIT_COMMIT_REF;
const PROJECT_BRANCH = process.env.PROJECT_BRANCH;

(() => {
	console.log('VERCEL_GIT_COMMIT_REF:', VERCEL_GIT_COMMIT_REF);
	console.log('git branch:', PROJECT_BRANCH);

	if (VERCEL_GIT_COMMIT_REF && VERCEL_GIT_COMMIT_REF === PROJECT_BRANCH) {
		console.log('✅ - Build can proceed');
		return 1;
	} else {
		console.log('🛑  - Build skipped');
		return 0;
	}
})();
