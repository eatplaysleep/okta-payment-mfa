/** @format */

import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { authConfig, routes } from './config';

import { AppFooter, AppNavBar } from './components/molecules';
import { AuthProvider, CartProvider, ProductsProvider } from './providers';
import './App.css';
import { Theme } from './theme';

const oktaAuth = new OktaAuth(authConfig.oidc);

oktaAuth.start();

const App = () => {
	const history = useHistory();
	const restoreOriginalUri = async (_oktaAuth, originalUri) =>
		history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
	const customAuthHandler = () => {
		history.push('/login');
	};

	return (
		<ThemeProvider theme={Theme}>
			<CssBaseline />
			<Security
				oktaAuth={oktaAuth}
				restoreOriginalUri={restoreOriginalUri}
				onAuthRequired={customAuthHandler}
			>
				<AuthProvider>
					<ProductsProvider>
						<CartProvider>
							<AppNavBar />
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
									{/* <Route path='/checkout' component={Checkout}/>
								<Route path='/store' component={Store} />
								<Route path='/login/callback' component={AppLoginCallback} />
								<Route path='/signin' component={SignInSide} />
								<Route path='/privacy' component={Privacy} />
								<Route path='/me' component={Profile} />
								<Route path='/terms' component={Terms} />
								<Route path='*' component={Home} /> */}
								</Switch>
							</div>
							<AppFooter />
						</CartProvider>
					</ProductsProvider>
				</AuthProvider>
			</Security>
		</ThemeProvider>
	);
};

export default App;
