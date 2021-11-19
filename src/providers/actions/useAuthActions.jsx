/** @format */

import { useOktaAuth } from '@okta/okta-react';
import base64url from 'base64url';
import { CryptoUtil, getUserInfo as getUser } from '../../utils';

const enrollWebAuthn = async data => {
	try {
		console.debug('enrolling WebAuthN...');

		const _embedded = data?._embedded?.activation,
			user = _embedded?.user,
			factorId = data?.id,
			challenge = _embedded?.challenge,
			rp = _embedded?.rp,
			attestation = _embedded?.attestation,
			pubKeyCredParams = _embedded?.pubKeyCredParams;

		let publicKey = {
			status: data?.status,
			challenge: CryptoUtil.strToBin(challenge),
			rp: {
				...rp,
			},
			user: {
				...user,
				id: CryptoUtil.strToBin(user.id),
			},
			attestation: attestation,
			pubKeyCredParams: pubKeyCredParams,
			authenticatorSelection: {
				authenticatorAttachment: 'platform',
				residentKey: 'required',
				requireResidentKey: true,
				userVerification: 'preferred',
			},
		};
		console.debug('publicKey:', JSON.stringify(publicKey, null, 2));

		const credential = await navigator.credentials.create({ publicKey });

		const attestationBin = CryptoUtil.binToStr(
				credential?.response?.attestationObject
			),
			clientData = CryptoUtil.binToStr(credential?.response?.clientDataJSON),
			requestData = {
				attestation: attestationBin,
				clientData: clientData,
			},
			url = `${window.location.origin}/api/${user?.id}/factors/${factorId}/activate`,
			options = {
				method: 'post',
				body: JSON.stringify(requestData),
			},
			extensionResults = credential.getClientExtensionResults();

		console.debug('extensionResults:', extensionResults);
		console.debug('credential:', credential);
		console.debug('clientDataJSON:', JSON.stringify(clientData, null, 2));
		const verification = await fetch(url, options);

		if (verification.ok) {
			return true;
		}
	} catch (err) {
		throw err;
	}
};

const generatePublicKeyRequest = async (challenge, { discover }) => {
	try {
		const { _embedded } = challenge || {};

		let publicKey = {
			challenge: CryptoUtil.strToBin(_embedded?.challenge?.challenge),
			userVerification: 'required',
		};

		console.debug('discover:', discover ?? false);

		if (!discover) {
			publicKey = {
				...publicKey,
				allowCredentials: await generateAllowedCredentials(
					_embedded?.enrolledFactors
				),
			};
		}

		console.debug('=== publicKey ===');
		console.debug(publicKey);

		return publicKey;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const generateAllowedCredentials = async (
	credentials = [],
	discover = false
) => {
	try {
		let allowCredentials = [];

		console.debug(credentials.length, 'enrolled credentials');

		for (let i = 0; i < credentials.length; i++) {
			let credential = credentials[i];

			console.debug(credential);
			if (
				credential?.factorType === 'webauthn' &&
				credential?.status === 'ACTIVE'
			) {
				allowCredentials.push({
					id: CryptoUtil.strToBin(credential?.profile?.credentialId),
					type: 'public-key',
				});
			}
		}

		console.debug('=== allowCredentials ===');
		console.debug(allowCredentials);

		return allowCredentials;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const lookupOktaFactorId = async (credentials = [], _credentialId) => {
	try {
		const credential = credentials.find(factor => {
			return factor?.profile?.credentialId === _credentialId;
		});

		console.debug('=== factorId ===');
		console.debug(credential?.id);
		console.debug('=== credentialId ===');
		console.debug(_credentialId);

		return credential?.id;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const buildOktaRequest = async (assertion, credentials) => {
	try {
		const _authenticatorData = CryptoUtil.binToStr(
				assertion?.response?.authenticatorData
			),
			_clientData = CryptoUtil.binToStr(assertion?.response?.clientDataJSON),
			_credentialId = assertion?.id,
			_signatureData = CryptoUtil.binToStr(assertion?.response?.signature),
			factorId = await lookupOktaFactorId(credentials, _credentialId),
			body = {
				authenticatorData: _authenticatorData,
				clientData: _clientData,
				signatureData: _signatureData,
			},
			request = {
				method: 'post',
				body: JSON.stringify(body),
			};

		const _userHandle = CryptoUtil.binToStr(assertion?.response?.userHandle),
			_clientDataJSON = JSON.parse(base64url.decode(_clientData));

		console.debug('=== factorId ===');
		console.debug(factorId);
		console.debug('=== okta request body ===');
		console.debug(body);

		if (_userHandle) {
			console.debug('=== userHandle ===');
			console.debug(_userHandle);
		}

		console.debug('=== clientData ===');
		console.debug(_clientDataJSON);

		return { request, factorId };
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getWebAuthnAssertion = async publicKey => {
	try {
		const assertion = await navigator.credentials.get({ publicKey: publicKey });

		console.debug('=== assertion ===');
		console.debug(assertion);

		return assertion;
	} catch (err) {
		throw err;
	}
};

const getWebAuthnChallenge = async ({ userId, factor }) => {
	const factorId = factor?.factorId ?? 'webauthn';

	// get challenge from Okta
	if (userId) {
		const url = `${window.location.origin}/api/${userId}/factors/${factorId}/verify`;
		const challenge = await fetch(url).then(resp => {
			if (resp.ok) {
				return resp.json();
			} else throw resp;
		});

		console.debug('=== challenge ===');
		console.debug(challenge);

		return challenge;
	} else {
		throw new Error('no userId provided!');
	}
};

const doWebAuthn = async options => {
	try {
		const userId = options?.factors[0]?.userId;

		// get challenge from Okta
		const challenge = await getWebAuthnChallenge({
			...options,
			userId,
		});

		// Generate PublicKeyCredentialRequestOptions
		const publicKey = await generatePublicKeyRequest(challenge, options);

		// Do navigator.credentials.get()
		const assertion = await getWebAuthnAssertion(publicKey);

		// build Okta verify request
		const { request, factorId } =
			(await buildOktaRequest(
				assertion,
				challenge?._embedded?.enrolledFactors
			)) || {};

		// call Okta to verify assertion
		const result = await fetch(
			`${window.location.origin}/api/${userId}/factors/${factorId}/verify`,
			request
		).then(resp => {
			if (resp.ok) {
				return resp.json();
			} else throw resp;
		});

		console.debug('=== result ===');
		console.debug(result);

		return result;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const factorMap = {
	webauthn: 'FIDO',
};

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
		} catch (err) {
			return console.error('loginWithCredentials error:', err);
		}
	};

	const login = async (dispatch, props) => {
		try {
			const tokens = props?.tokens;

			if (oktaAuth.isLoginRedirect() || tokens) {
				console.debug('handling Okta redirect...');

				dispatch({ type: 'LOGIN_REDIRECT' });

				const isStepUp = props?.stepup;

				if (isStepUp) {
					await oktaAuth.storeTokensFromRedirect();

					oktaAuth.removeOriginalUri();

					await oktaAuth.authStateManager.updateAuthState();

					return;
				} else {
					console.debug('handling redirect...');

					if (tokens) {
						console.debug('tokens:', tokens);
					}

					await oktaAuth.handleLoginRedirect(tokens);

					return getUser(oktaAuth, dispatch);
				}
			} else if (!authState?.isAuthenticated) {
				console.debug('setting original uri...');

				oktaAuth.setOriginalUri(window.location.href);

				console.debug('checking for existing Okta session...');

				const hasSession = await oktaAuth.session.exists();

				console.debug('session:', hasSession);

				if (!hasSession) {
					const loginHint = props?.loginhint;

					console.debug('loginHint:', loginHint);

					console.debug('doing signInWithRedirect...');

					dispatch({ type: 'LOGIN' });

					// return oktaAuth.token.getWithPopup();
					return oktaAuth.signInWithRedirect({
						loginHint: loginHint,
					});
				} else {
					const { tokens } = await oktaAuth.token.getWithoutPrompt();

					if (tokens) {
						await oktaAuth.tokenManager.setTokens(tokens);
					}
				}
				return getUser(oktaAuth, dispatch);
			}
		} catch (err) {
			if (dispatch) {
				dispatch({ type: 'LOGIN_ERROR', error: err });
			}
			return console.error('login error:', err);
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
						return await enrollWebAuthn(await resp.json());
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
					result = await doWebAuthn(options);
					break;
				default:
					break;
			}

			if (!result) {
				message = 'Something went awry.';
			}

			dispatch({
				type: 'STEP_UP_SUCCESS',
				payload: { message, factorsAreLoading: false, isStale: false },
			});

			return message;
		} catch (err) {
			console.error(err);
			return dispatch({ type: 'MFA_ERROR', error: err });
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

				console.debug(JSON.stringify(factors, null, 2));

				return dispatch({
					type: 'SUCCESS',
					payload: { factors, isStale: false, factorsAreLoading: false },
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
	};
};
