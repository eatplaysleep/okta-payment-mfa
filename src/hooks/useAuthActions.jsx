/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { removeNils, getOAuthUrls } from '@okta/okta-auth-js';
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

const factorMap = {
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

				const { tokens } = (await oktaAuth.token.getWithoutPrompt(config)) || {};

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
				const { loginHint } = options || {};
				dispatch({ type: 'LOGIN_IFRAME_STARTED' });

				// if (!isVisibleAuthModal) {
				// 	console.debug('authModal is not visible, cancelling login');
				// 	return dispatch({ type: 'LOGIN_CANCELLED' });
				// }

				if (loginHint) {
					console.debug('loginHint:', loginHint);
				}

				console.debug('generating URL...');

				const { authUrl, tokenParams } = await generateAuthUrl(oktaAuth);

				console.debug('authState:', authState);

				if (authUrl && tokenParams) {
					return dispatch({
						type: 'LOGIN_TOKEN_PARAMS_GENERATED',
						payload: { authUrl, tokenParams },
					});
				}
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
				const {
					tokens,
					state,
					code: authorizationCode,
					interaction_code: interactionCode,
					isVisibleAuthModal,
				} = props || {};

				const isCodeExchange = authorizationCode || interactionCode || false;

				if (isCodeExchange) {
					dispatch({ type: 'LOGIN_CODE_EXCHANGE_STARTED' });

					const tokenParams = oktaAuth.transactionManager.load({ oauth: true, pkce: true, state });

					const response = await oktaAuth.token.exchangeCodeForTokens({
						...tokenParams,
						authorizationCode,
						interactionCode,
					});

					if (!response?.tokens) {
						return dispatch({
							type: 'LOGIN_CODE_EXCHANGE_FAILED',
							error: `No tokens in response. Something went wrong! [${response}]`,
						});
					}

					dispatch({ type: 'LOGIN_CODE_EXCHANGED' });

					await oktaAuth.tokenManager.setTokens(response.tokens);

					const { isAuthenticated } = await oktaAuth.authStateManager.updateAuthState();

					return dispatch({
						type: 'LOGIN_COMPLETED',
						payload: { isAuthenticated, isStaleUser: true },
					});
				} else if (oktaAuth.isLoginRedirect() || tokens) {
					console.debug('handling Okta redirect...');

					dispatch({ type: 'LOGIN_REDIRECT_STARTED' });

					await oktaAuth.storeTokensFromRedirect();

					oktaAuth.removeOriginalUri();

					await oktaAuth.authStateManager.updateAuthState();

					return dispatch({ type: 'LOGIN_COMPLETED' });
				} else if (!authState?.isAuthenticated) {
					dispatch({ type: 'LOGIN_STARTED' });
					console.debug('setting original uri...');

					oktaAuth.setOriginalUri(window.location.href);

					console.debug('checking for existing Okta session...');

					const hasSession = await oktaAuth.session.exists();

					console.debug('session:', hasSession);

					if (!hasSession) {
						const loginHint = props?.loginhint;

						return await iFrameAuth(dispatch, {
							loginHint,
							isVisibleAuthModal,
						});
					} else {
						return await silentAuth(dispatch, {
							hasSession,
							isVisibleAuthModal,
						});
					}
				}
				console.log('no login action to take');
			} catch (error) {
				if (dispatch) {
					dispatch({ type: 'LOGIN_FAILED', error: error });
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
			dispatch({ type: 'LOGOUT_STARTED' });

			localStorage.removeItem('user');

			return oktaAuth.signOut(config).then(() => dispatch({ type: 'LOGOUT_SUCCEEDED' }));
		};

		const enrollMFA = async (dispatch, userId, factor) => {
			try {
				const url = `${window.location.origin}/api/${userId}/factors`;

				dispatch({ type: 'FACTOR_ENROLL_STARTED' });

				const request = {
					factorType: factor,
					provider: factorMap[factor],
				};

				const options = {
					method: 'post',
					body: JSON.stringify(request),
				};

				const resp = await fetch(url, options);

				if (resp.ok) {
					switch (factor) {
						case 'webauthn':
							await webAuthnAttest(dispatch, await resp.json());
							break;
						default:
							break;
					}
				}

				await fetchFactors(dispatch, userId);

				return dispatch({ type: 'FACTOR_ENROLL_SUCCEEDED' });
			} catch (error) {
				return dispatch({ type: 'FACTOR_ENROLL_FAILED', error });
			}
		};

		const issueMFA = async (dispatch, options) => {
			try {
				let message = 'Successfully authenticated!',
					result = false;

				dispatch({ type: 'MFA_ISSUE_STARTED' });

				switch (options?.method) {
					case 'webauthn':
						result = await webAuthnAssert(dispatch, options);
						break;
					default:
						break;
				}

				if (result?.success) {
					dispatch({
						type: 'MFA_ISSUE_SUCCEEDED',
						payload: { message, factorsAreLoading: false, isStale: false },
					});
				} else if (result?.code === 'MFA_ISSUE_USER_CANCELLED') {
					return { success: false };
				} else {
					message = 'Something went awry.';
				}

				return { message, success: result?.success };
			} catch (error) {
				return dispatch({ type: 'MFA_ISSUE_FAILED', error: error });
			}
		};

		const fetchAvailableFactors = async (dispatch, userId) => {
			try {
				dispatch({ type: 'FACTORS_FETCH_AVAILABLE_STARTED' });

				const url = `${window.location.origin}/api/${userId}/factors/catalog`;

				const response = await fetch(url);

				if (!response.ok) {
					throw response;
				}

				const availableFactors = await response.json();

				dispatch({
					type: 'FACTORS_FETCH_AVAILABLE_SUCCESS',
					payload: { availableFactors },
				});
			} catch (error) {
				return dispatch({ type: 'FACTORS_FETCH_AVAILABLE_FAILED', error });
			}
		};

		const fetchFactors = async (dispatch, userId) => {
			try {
				if (userId) {
					dispatch({ type: 'FACTORS_FETCH_STARTED' });

					let url = `${window.location.origin}/api/${userId}/factors`;

					const factors = await fetch(url).then((resp) => {
						if (resp.ok) {
							return resp.json();
						} else throw resp;
					});

					// console.debug(JSON.stringify(factors, null, 2));
					const hasWebAuthn = _.findIndex(factors, { factorType: 'webauthn' }) > 0;

					return dispatch({
						type: 'FACTORS_FETCH_SUCCEEDED',
						payload: {
							factors,
							hasWebAuthn,
						},
					});
				} else throw new Error('Missing userId!');
			} catch (error) {
				console.error(error);
				return dispatch({ type: 'FACTORS_FETCH_FAILED', error });
			}
		};

		const removeFactor = async (dispatch, { userId, factorId }) => {
			try {
				const url = `${window.location.origin}/api/${userId}/factors/${factorId}`;
				const options = {
					method: 'DELETE',
				};

				dispatch({ type: 'FACTOR_REMOVE_STARTED' });
				console.log('deleting factor...');
				const response = await fetch(url, options);

				if (!response.ok) {
					throw response;
				}

				// refresh the factors
				await fetchFactors(dispatch, userId);

				dispatch({ type: 'FACTOR_REMOVE_SUCCEEDED' });

				return factorId;
			} catch (err) {
				console.error(err);
				return dispatch({ type: 'FACTOR_REMOVE_FAILED' });
			}
		};

		return {
			enrollMFA,
			fetchAvailableFactors,
			fetchFactors,
			getUser,
			idxLogin,
			issueMFA,
			login,
			loginWithCredentials,
			logout,
			removeFactor,
			silentAuth,
		};
	} catch (error) {
		console.error(`init error [${error}]`);
		throw new Error(error);
	}
};

const generateAuthUrl = async (sdk) => {
	try {
		const tokenParams = await sdk.token.prepareTokenParams(),
			{ issuer, authorizeUrl } = sdk.options || {};

		const urls = getOAuthUrls(sdk, tokenParams);

		const meta = {
			issuer,
			urls,
			...tokenParams,
		};

		// Use the query params to build the authorize url

		// Get authorizeUrl and issuer
		const url = authorizeUrl ?? `${issuer}/v1/authorize`;

		const authUrl = url + buildAuthorizeParams(tokenParams);

		sdk.transactionManager.save(meta, { oauth: true });

		return { authUrl, tokenParams };
	} catch (error) {
		throw new Error(`Unable to generate auth url [${error}]`);
	}
};
const buildAuthorizeParams = (tokenParams) => {
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
