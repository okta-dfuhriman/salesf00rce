import { LDS, React } from './common';
import AuthProvider from './providers/AuthProvider/AuthContext';
import { useLocation } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClient, QueryClientProvider } from 'react-query';

import useBodyClass from './hooks/useBodyClass';

import Router from './Router';

const STALE_TIME = process.env.QUERY_STALE_TIME || 2.5; // Time in **MINUTES** to be used when setting the staleTime configuration.

const queryClient = new QueryClient({
	defaultOptions: { queries: { staleTime: 1000 * 60 * STALE_TIME } },
});

const App = () => {
	useBodyClass('tds-bg_sand');

	const { pathname } = useLocation();

	// Setting page scroll to 0 when changing the route
	React.useEffect(() => {
		document.documentElement.scrollTop = 0;

		if (document?.scrollingElement) {
			document.scrollingElement.scrollTop = 0;
		}
	}, [pathname]);

	return (
		<React.Suspense fallback={<LDS.Spinner variant='brand' />}>
			<QueryClientProvider client={queryClient}>
				<AuthProvider>
					<LDS.IconSettings iconPath='/assets/icons'>
						<Router />
					</LDS.IconSettings>
				</AuthProvider>
				<ReactQueryDevtools initialIsOpen={true} />
			</QueryClientProvider>
		</React.Suspense>
	);
};

export default App;
