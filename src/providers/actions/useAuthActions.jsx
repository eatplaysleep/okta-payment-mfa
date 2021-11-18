/** @format */

import { useOktaAuth } from '@okta/okta-react';
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

const verifyWebAuthn = async (url, challenge, factors) => {
	try {
		let allowCredentials = [];

		const challengeBin = CryptoUtil.strToBin(
			challenge._embedded?.challenge?.challenge
		);

		for (let i = 0; i < factors.length; i++) {
			let factor = factors[i];

			allowCredentials.push({
				id: CryptoUtil.strToBin(factor?.device?.id),
				type: 'public-key',
				transports: ['internal'],
			});
		}

		// const allowCredentials = [
		// 	{
		// 		id: CryptoUtil.strToBin(challenge?.profile?.credentialId),
		// 		type: 'public-key',
		// 		transports: ['internal'],
		// 	},
		// ];

		const publicKey = {
			challenge: challengeBin,
			// allowCredentials: allowCredentials,
			userVerification: 'required',
		};

		console.debug('publicKey:', JSON.stringify(publicKey, null, 2));

		const assertion = await navigator.credentials
			.get({ publicKey: publicKey })
			.then(resp => {
				console.debug('assertion:', resp);
				return resp;
			});

		const _credentialId = assertion?.response?.id,
			_authenticatorData = CryptoUtil.binToStr(
				assertion?.response?.authenticatorData
			),
			_clientData = CryptoUtil.binToStr(assertion?.response?.clientDataJSON),
			_signatureData = CryptoUtil.binToStr(assertion?.response?.signature),
			_userHandle = CryptoUtil.binToStr(assertion?.response?.userHandle),
			{ factorId } =
				factors.find(factor => factor?.device?.id === _credentialId) || {},
			request = {
				method: 'post',
				body: {
					authenticatorData: _authenticatorData,
					clientData: _clientData,
					signatureData: _signatureData,
				},
			};

		console.debug(
			'response:',
			JSON.stringify(
				{
					_credentialId,
					_authenticatorData,
					_clientData,
					_signatureData,
					_userHandle,
				},
				null,
				2
			)
		);

		return await fetch(`${url}/factors/${factorId}/verify`, request).then(
			resp => {
				if (resp.ok) {
					return resp.json();
				} else throw resp;
			}
		);

		// return response?.factorResult === 'SUCCESS';
	} catch (err) {
		throw err;
	}
};

const webAuthnChallenge = async factors => {
	const userId = factors[0]?.userId;
	if (userId) {
		const url = `${window.location.origin}/api/${userId}/factors/webauthn/verify`;
		const challenge = await fetch(url).then(resp => {
			if (resp.ok) {
				return resp.json();
			} else throw resp;
		});

		return await verifyWebAuthn(url, challenge, factors);
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

	const issueMFA = async (dispatch, method, factors = [], factor) => {
		try {
			let message = 'Successfully authenticated!',
				result = false;

			switch (method) {
				case 'webauthn':
					result = await webAuthnChallenge(factors);
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
