/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { removeNils } from '@okta/okta-auth-js';
import { useWebAuthn } from '../hooks';
import { getUserInfo as getUser, toQueryString } from '../utils';
import * as _ from 'lodash';

const oAuthParamMap = {
	clientId: 'client_id',
	codeChallenge: 'code_challenge',
	codeChallengeMethod: 'code_challenge_method',
	display: 'display',
	idp: 'idp',
	idpScope: 'idp_scope',
	loginHint: 'login_hint',
	maxAge: 'max_age',
	nonce: 'nonce',
	prompt: 'prompt',
	redirectUri: 'redirect_uri',
	responseMode: 'response_mode',
	responseType: 'response_type',
	sessionToken: 'sessionToken',
	state: 'state',
	scopes: 'scope',
	grantType: 'grant_type',
};

const factorProviderMap = {
	webauthn: 'FIDO',
};

export const useAuthActions = () => {
	try {
		const { authState, oktaAuth } = useOktaAuth();
		const { webAuthnAssert, webAuthnAttest } = useWebAuthn();

		const silentAuth = async (dispatch, options) => {
			let { hasSession, authModalIsVisible } = options || {};

			try {
				let config = {};

				if (hasSession === undefined) {
					console.debug('checking for existing Okta session...');

					hasSession = await oktaAuth.session.exists();

					console.debug('session:', hasSession);
				}

				if (!hasSession) {
					dispatch({ type: 'SILENT_AUTH_END' });
					return;
				}

				dispatch({
					type: 'SILENT_AUTH_START',
				});

				if (!options) {
					config.redirectUri = `${window.location.origin}/login/callback`;
				}

				const { tokens } =
					(await oktaAuth.token.getWithoutPrompt(config)) || {};

				if (tokens) {
					await oktaAuth.tokenManager.setTokens(tokens);

					dispatch({ type: 'SILENT_AUTH_SUCCESS' });
					return getUser(oktaAuth, dispatch);
				} else return;
			} catch (error) {
				if (error?.errorCode === 'login_required') {
					console.debug(error);
					dispatch({ type: 'SILENT_AUTH_CANCEL' });
					return iFrameAuth(dispatch, { authModalIsVisible });
				} else {
					throw new Error(error);
				}
			}
		};

		// const signInWithRedirect = async (dispatch, options) => {
		// 	try {
		// 		const { loginHint } = options || {};

		// 		if (loginHint) {
		// 			console.debug('loginHint:', loginHint);
		// 		}

		// 		console.debug('doing signInWithRedirect...');

		// 		dispatch({ type: 'LOGIN' });

		// 		return oktaAuth.signInWithRedirect({
		// 			loginHint: loginHint,
		// 		});
		// 	} catch (error) {
		// 		throw new Error(error);
		// 	}
		// };

		const iFrameAuth = async (dispatch, options) => {
			try {
				const { authModalIsVisible, loginHint } = options || {};

				if (!authModalIsVisible) {
					console.debug('authModal is not visible, cancelling login');
					return dispatch({ type: 'LOGIN_CANCEL' });
				}

				if (loginHint) {
					console.debug('loginHint:', loginHint);
				}

				console.debug('generating URL...');

				dispatch({ type: 'LOGIN_START' });

				const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth);

				console.debug('authState:', authState);

				return dispatch({
					type: 'LOGIN_AUTHORIZE',
					payload: { authUrl, tokenParams },
				});
			} catch (error) {
				throw new Error(error);
			}
		};

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

					if (transaction?.status === 'AUTHN_SUCCESS') {
						oktaAuth.signInWithRedirect({
							sessionToken: transaction.sessionToken,
						});
					}
				} catch (err) {
					if (dispatch) {
						dispatch({ type: 'LOGIN_ERROR', error: err });
					} else throw err;
				}
			} catch (error) {
				return console.error('loginWithCredentials error:', error);
			}
		};

		const login = async (dispatch, props) => {
			try {
				const { tokens, tokenParams, authModalIsVisible } = props || {};

				const { authorizationCode, interaction_code } = tokenParams || {};

				const isCodeExchange = authorizationCode || interaction_code || false;

				if (isCodeExchange) {
					console.log(tokenParams);
					const response = await oktaAuth.token.exchangeCodeForTokens(
						tokenParams
					);

					if (!response?.tokens) {
						return dispatch({
							type: 'LOGIN_ERROR',
							error: `No tokens in response. Something went wrong! [${response}]`,
						});
					}

					await oktaAuth.tokenManager.setTokens(response.tokens);

					await oktaAuth.authStateManager.updateAuthState();

					return dispatch({ type: 'LOGIN_SUCCESS' });
				} else if (oktaAuth.isLoginRedirect() || tokens) {
					console.debug('handling Okta redirect...');

					dispatch({ type: 'LOGIN_REDIRECT' });

					await oktaAuth.storeTokensFromRedirect();

					oktaAuth.removeOriginalUri();

					await oktaAuth.authStateManager.updateAuthState();

					return;
				} else if (!authState?.isAuthenticated) {
					console.debug('setting original uri...');

					oktaAuth.setOriginalUri(window.location.href);

					console.debug('checking for existing Okta session...');

					const hasSession = await oktaAuth.session.exists();

					console.debug('session:', hasSession);

					if (!hasSession) {
						const loginHint = props?.loginhint;

						return await iFrameAuth(dispatch, {
							loginHint,
							authModalIsVisible,
						});
					} else {
						return await silentAuth(dispatch, {
							hasSession,
							authModalIsVisible,
						});
					}
				}
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_ERROR', error: error });
				}
				return console.error('login error:', error);
			}
		};

		const idxLogin = async (dispatch, props) => {
			try {
				const CLIENT_ID = process.env.REACT_APP_STEP_UP_CLIENT_ID;
				const { input } = props || {};
				console.debug('input:', JSON.stringify(input, null, 2));
				oktaAuth.options.clientId = CLIENT_ID;

				// if (input?.username && input?.password) {
				// 	input.authenticators = ['email'];
				// }

				const resp = await oktaAuth.idx.authenticate(input);

				console.debug(resp);

				oktaAuth.options.clientId = process.env.REACT_APP_OKTA_CLIENT_ID;

				return dispatch({
					type: 'IDX_NEXT',
					payload: { isStale: false, authStep: resp },
				});
				// return resp;
			} catch (err) {
				console.error(err);
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

			return oktaAuth
				.signOut(config)
				.then(() => dispatch({ type: 'LOGOUT_SUCCESS' }));
		};

		const enrollMFA = async (dispatch, userId, factor) => {
			try {
				const url = `${window.location.origin}/api/${userId}/factors`;

				const factorType = factor.toLowerCase();

				const request = {
					factorType: factorType,
					provider: factorProviderMap[factorType],
				};

				const options = {
					method: 'post',
					body: JSON.stringify(request),
				};

				const resp = await fetch(url, options);

				if (resp.ok) {
					switch (factorType) {
						case 'webauthn':
							return await webAuthnAttest(dispatch, await resp.json());
						default:
							break;
					}
				}
			} catch (err) {
				console.error(err);
				return dispatch({ type: 'MFA_ERROR', error: err });
			}
		};

		const issueMFA = async (dispatch, options) => {
			try {
				let message = 'Successfully authenticated!',
					result = false;

				switch (options?.method) {
					case 'webauthn':
						result = await webAuthnAssert(dispatch, options);
						break;
					default:
						break;
				}

				if (result?.success) {
					dispatch({
						type: 'MFA_SUCCESS',
						payload: { message, factorsAreLoading: false, isStale: false },
					});
				} else if (result?.code === 'USER_CANCELLED') {
					return { success: false };
				} else {
					message = 'Something went awry.';
				}

				return { message, success: result?.success };
			} catch (error) {
				return dispatch({ type: 'MFA_ERROR', error: error });
			}
		};

		const fetchFactors = async (dispatch, userId) => {
			try {
				if (userId) {
					dispatch({ type: 'GET_FACTORS' });

					let url = `${window.location.origin}/api/${userId}/factors`;

					const factors = await fetch(url).then(resp => {
						if (resp.ok) {
							return resp.json();
						} else throw resp;
					});

					// console.debug(JSON.stringify(factors, null, 2));
					const hasWebAuthn =
						_.findIndex(factors, { factorType: 'webauthn' }) > 0;

					return dispatch({
						type: 'SUCCESS',
						payload: {
							factors,
							isStale: false,
							factorsAreLoading: false,
							hasWebAuthn,
						},
					});
				} else throw new Error('Missing userId!');
			} catch (err) {
				console.error(err);
				return dispatch({ type: 'FETCH_ERROR', error: err });
			}
		};

		return {
			enrollMFA,
			fetchFactors,
			getUser,
			idxLogin,
			issueMFA,
			login,
			loginWithCredentials,
			logout,
			silentAuth,
		};
	} catch (error) {
		console.error(`init error [${error}]`);
		throw new Error(error);
	}
};

const generateAuthUrl = async sdk => {
	try {
		const tokenParams = await sdk.token.prepareTokenParams(),
			{ issuer, authorizeUrl } = sdk.options || {};

		// Use the query params to build the authorize url

		// Get authorizeUrl and issuer
		const url = authorizeUrl ?? `${issuer}/v1/authorize`;

		const authUrl = url + buildAuthorizeParams(tokenParams);

		return { authUrl, tokenParams };
	} catch (error) {
		throw new Error(`Unable to generate auth url [${error}]`);
	}
};
const buildAuthorizeParams = tokenParams => {
	let params = {};

	for (const [key, value] of Object.entries(tokenParams)) {
		let oAuthKey = oAuthParamMap[key];

		if (oAuthKey) {
			params[oAuthKey] = value;
		}
	}

	params.response_mode = 'okta_post_message';

	params = removeNils(params);

	return toQueryString(params);
};
