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
			rp: rp,
			user: {
				...user,
				id: CryptoUtil.strToBin(user.id),
			},
			attestation: attestation,
			pubKeyCredParams: pubKeyCredParams,
			authenticatorSelection: {
				authenticatorAttachment: 'platform',
			},
		};
		console.debug('publicKey:', JSON.stringify(publicKey, null, 2));

		const enrollResp = await navigator.credentials.create({ publicKey });

		const attestationBin = CryptoUtil.binToStr(
				enrollResp?.response?.attestationObject
			),
			clientData = CryptoUtil.binToStr(enrollResp?.response?.clientDataJSON),
			requestData = {
				attestation: attestationBin,
				clientData: clientData,
			},
			url = `${window.location.origin}/api/${user?.id}/factors/${factorId}/activate`,
			options = {
				method: 'post',
				body: JSON.stringify(requestData),
			};

		const verification = await fetch(url, options);

		if (verification.ok) {
			return true;
		}
	} catch (err) {
		throw err;
	}
};

const verifyWebAuthN = async (url, challenge) => {
	try {
		const allowCredentials = [
			{
				id: CryptoUtil.strToBin(challenge?.profile?.credentialId),
				type: 'public-key',
				transports: ['internal'],
			},
		];

		challenge._embedded.challenge.challenge = CryptoUtil.strToBin(
			challenge?._embedded?.challenge?.challenge
		);

		const publicKey = {
			...challenge?._embedded.challenge,
			allowCredentials: allowCredentials,
			userVerification: 'required',
		};

		console.debug('publicKey:', JSON.stringify(publicKey, null, 2));
		const assertion = await navigator.credentials
			.get({ publicKey: publicKey })
			.then(resp => {
				console.debug('assertion:', JSON.stringify(resp, null, 2));
				return resp;
			});

		const request = {
			method: 'post',
			body: JSON.stringify({
				authenticatorData: CryptoUtil.binToStr(
					assertion?.response?.authenticatorData
				),
				clientData: CryptoUtil.binToStr(assertion?.response?.clientDataJSON),
				signatureData: CryptoUtil.binToStr(assertion?.response?.signature),
			}),
		};

		const response = await fetch(url, request).then(resp => {
			if (resp.ok) {
				return resp.json();
			} else throw resp;
		});

		return response?.factorResult === 'SUCCESS';
	} catch (err) {
		throw err;
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
			if (oktaAuth.isLoginRedirect()) {
				console.debug('handling Okta redirect...');

				dispatch({ type: 'LOGIN_REDIRECT' });

				const isStepUp = props?.stepup;

				if (isStepUp) {
					await oktaAuth.storeTokensFromRedirect();

					oktaAuth.removeOriginalUri();

					await oktaAuth.authStateManager.updateAuthState();

					return;
				} else {
					await oktaAuth.handleLoginRedirect();

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

	const issueMFA = async (dispatch, userId, { factorId, factorType }) => {
		try {
			let message = 'Successfully authenticated!',
				result = false;

			const url = `${window.location.origin}/api/${userId}/factors/${factorId}/verify`;

			const challenge = await fetch(url).then(resp => {
				if (resp.ok) {
					return resp.json();
				} else throw resp;
			});

			switch (factorType) {
				case 'webauthn':
					result = await verifyWebAuthN(url, challenge);
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
		issueMFA,
		login,
		loginWithCredentials,
		logout,
	};
};
