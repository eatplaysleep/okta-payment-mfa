/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { getUserInfo as getUser } from '../../utils';

export const useAuthActions = () => {
	const { authState, oktaAuth } = useOktaAuth();

	const loginWithCredentials = async (dispatch, userLogin) => {
		try {
			try {
				// execute the login
				console.debug('executing loginWithCredentials...');
				dispatch({ type: 'LOGIN_WITH_CREDENTIALS' });

				const transaction = await oktaAuth.signInWithCredentials({
					sendFingerprint: true,
					...userLogin,
				});

				if (transaction?.status === 'SUCCESS') {
					oktaAuth.signInWithRedirect({
						sessionToken: transaction.sessionToken,
					});
				}
			} catch (err) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_ERROR', error: err });
				} else throw err;
			}
		} catch (err) {
			return console.error('loginWithCredentials error:', err);
		}
	};

	const login = async (dispatch, props) => {
		try {
			if (oktaAuth.isLoginRedirect()) {
				console.debug('handling Okta redirect...');

				dispatch({ type: 'LOGIN_REDIRECT' });

				console.log(oktaAuth.getOriginalUri());

				await oktaAuth.handleLoginRedirect();

				return getUser(oktaAuth, dispatch);
			} else if (!authState?.isAuthenticated) {
				console.debug('setting original uri...');

				oktaAuth.setOriginalUri(window.location.href);

				console.debug('checking for existing Okta session...');

				const hasSession = await oktaAuth.session.exists();

				console.debug('session:', hasSession);

				if (hasSession) {
					const tokens = await oktaAuth.token.getWithoutPrompt();

					if (tokens) {
						return await oktaAuth.tokenManager.setTokens(tokens);
					}
				} else {
					const loginHint = props?.loginHint;

					console.debug('loginHint:', loginHint);

					console.debug('doing signInWithRedirect...');

					dispatch({ type: 'LOGIN' });

					return oktaAuth.signInWithRedirect({
						loginHint: props?.loginHint,
					});
				}
			}
		} catch (err) {
			if (dispatch) {
				dispatch({ type: 'LOGIN_ERROR', error: err });
			}
			return console.error('login error:', err);
		}
	};

	const logout = (dispatch, postLogoutRedirect) => {
		let config = {};

		if (postLogoutRedirect) {
			config = { postLogoutRedirectUri: postLogoutRedirect };
		}

		console.info('executing logout...');
		dispatch({ type: 'LOGOUT' });

		localStorage.removeItem('user');

		return oktaAuth.signOut(config).then(() => dispatch({ type: 'SUCCESS' }));
	};

	return { getUser, login, loginWithCredentials, logout };
};
