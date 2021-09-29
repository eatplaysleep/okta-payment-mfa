/** @format */

import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { Security, SecureRoute, LoginCallback } from '@okta/okta-react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import config from './config';

import { Checkout, Home, Privacy, Terms } from './components/organisms';
import { AppFooter, AppNavBar } from './components/molecules';
import { SignInSide } from './components/SignIn';
import logo from './logo.svg';
import './App.css';
import { Theme } from './theme';

const oktaAuth = new OktaAuth(config.oidc);

const App = () => {
	const history = useHistory();
	const restoreOriginalUri = async (_oktaAuth, originalUri) => {
		history.replace(
			toRelativeUrl(originalUri || '/', window?.location?.origin)
		);
	};
	const customAuthHandler = () => {
		history.push('/signin');
	};

	return (
		<ThemeProvider theme={Theme}>
			<CssBaseline />
			<Security
				oktaAuth={oktaAuth}
				restoreOriginalUri={restoreOriginalUri}
				onAuthRequired={customAuthHandler}
			>
				<AppNavBar />
				<div>
					<Switch>
						<Route path='/checkout' component={Checkout} />
						<Route path='/login/callback' component={LoginCallback} />
						<Route path='/signin' component={SignInSide} />
						<Route path='/privacy' component={Privacy} />
						<Route path='/terms' component={Terms} />
						<Route path='*' component={Home} />
					</Switch>
				</div>
				<AppFooter />
			</Security>
		</ThemeProvider>
	);
};

// function App() {
// 	return (
// 		<div className='App'>
// 			<header className='App-header'>
// 				<img src={logo} className='App-logo' alt='logo' />
// 				<p>
// 					Edit <code>src/App.js</code> and save to reload.
// 				</p>
// 				<a
// 					className='App-link'
// 					href='https://reactjs.org'
// 					target='_blank'
// 					rel='noopener noreferrer'
// 				>
// 					Learn React
// 				</a>
// 			</header>
// 		</div>
// 	);
// }

export default App;
