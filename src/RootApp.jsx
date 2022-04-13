/** @format */
import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security } from '@okta/okta-react';
import { SnackbarProvider } from 'notistack';

import App from './App';
import { authConfig } from './config';
import { AuthProvider } from './providers';
import { Theme } from './styles/Theme';

const oktaAuth = new OktaAuth(authConfig.oidc);

oktaAuth.start();

const RootApp = () => {
	const history = useHistory();
	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
	const customAuthHandler = () => {
		history.push('/');
	};
	return (
		<ThemeProvider theme={Theme}>
			<CssBaseline />
			<React.Suspense fallback={<div>Loading...</div>}>
				<Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler}>
					<AuthProvider>
						<SnackbarProvider preventDuplicate={true}>
							<App />
						</SnackbarProvider>
					</AuthProvider>
				</Security>
			</React.Suspense>
		</ThemeProvider>
	);
};

export default RootApp;
