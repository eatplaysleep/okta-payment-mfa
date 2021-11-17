/** @format */

import React, { Suspense } from 'react';
import { Route, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute } from '@okta/okta-react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { authConfig, routes } from './config';

import { AppFooter, AppNavBar, SignIn } from './components';
import { AuthProvider, CartProvider, ProductsProvider } from './providers';
import './App.css';
import { Theme } from './theme';

const oktaAuth = new OktaAuth(authConfig.oidc);

oktaAuth.start();

const App = () => {
	const isStepUp = useRouteMatch('/stepup/callback');
	const history = useHistory();
	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
	const customAuthHandler = () => {
		history.push('/login');
	};

	return (
		<ThemeProvider theme={Theme}>
			<CssBaseline />
			<Suspense fallback={<div>Loading...</div>}>
				<Security
					oktaAuth={oktaAuth}
					restoreOriginalUri={restoreOriginalUri}
					onAuthRequired={customAuthHandler}
				>
					<AuthProvider>
						<ProductsProvider>
							<CartProvider>
								<Route path='/login' component={SignIn} exact />
								{!isStepUp && <AppNavBar />}
								<div>
									<Switch>
										{routes.map(route => {
											if (route?.isSecure) {
												return (
													<SecureRoute
														key={route.path}
														path={route.path}
														exact={route?.exact ?? false}
														component={route.component}
													/>
												);
											} else {
												return (
													<Route
														key={route.path}
														path={route.path}
														exact={route?.isExact ?? false}
														component={route.component}
													/>
												);
											}
										})}
									</Switch>
								</div>
								{!isStepUp && <AppFooter />}
							</CartProvider>
						</ProductsProvider>
					</AuthProvider>
				</Security>
			</Suspense>
		</ThemeProvider>
	);
};

export default App;
