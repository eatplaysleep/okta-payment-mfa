/** @format */
import base64url from 'base64url';
import { CryptoUtil } from '../utils';

const generatePublicKeyRequest = async (challenge, { discover, factor }) => {
	try {
		// const { _embedded } = challenge || {};

		const {
			_embedded: {
				challenge: { challenge: _embeddedChallenge },
				enrolledFactors,
			},
		} = challenge;

		let publicKey = {
			challenge: CryptoUtil.strToBin(_embeddedChallenge),
			userVerification: 'required',
		};

		console.debug('discover:', discover ?? false);

		if (!discover) {
			publicKey = {
				...publicKey,
				allowCredentials: await generateAllowedCredentials(enrolledFactors, factor),
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

const generateAllowedCredentials = async (credentials = [], factor) => {
	try {
		let allowCredentials = [];

		if (factor?.id) {
			credentials = [factor];
		}

		for (let i = 0; i < credentials.length; i++) {
			let credential = credentials[i];

			console.debug(credential);
			if (credential?.factorType === 'webauthn' && credential?.status === 'ACTIVE') {
				allowCredentials.push({
					id: CryptoUtil.strToBin(credential?.profile?.credentialId),
					type: 'public-key',
				});
			}
		}

		// console.debug('=== allowCredentials ===');
		// console.debug(allowCredentials);

		return allowCredentials;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const lookupOktaFactorId = async (credentials = [], _credentialId) => {
	try {
		const credential = credentials.find((factor) => {
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
		const {
			id: _credentialId,
			response: { clientDataJSON, authenticatorData, signature, userHandle },
		} = assertion || {};
		const _authenticatorData = CryptoUtil.binToStr(authenticatorData);
		// const _authenticatorData = CryptoUtil.binToStr(assertion?.response?.authenticatorData);
		const _clientData = CryptoUtil.binToStr(clientDataJSON);
		// const _credentialId = assertion?.id;
		const _signatureData = CryptoUtil.binToStr(signature);
		const factorId = await lookupOktaFactorId(credentials, _credentialId);
		const body = {
			authenticatorData: _authenticatorData,
			clientData: _clientData,
			signatureData: _signatureData,
		};
		const request = {
			method: 'post',
			body: JSON.stringify(body),
		};

		const _userHandle = CryptoUtil.binToStr(userHandle);
		const _clientDataJSON = JSON.parse(base64url.decode(_clientData));

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

const getWebAuthnAssertion = async (publicKey) => {
	try {
		const assertion = await navigator.credentials.get({ publicKey: publicKey });

		console.debug('=== assertion ===');
		console.debug(assertion);

		return assertion;
	} catch (err) {
		throw err;
	}
};

const getWebAuthnChallenge = async (options) => {
	const { userId, factor } = options || {};

	const { factorId = 'webauthn' } = factor || {};
	// get challenge from Okta
	if (userId) {
		const url = `${window.location.origin}/api/${userId}/factors/${factorId}/verify`;
		const challenge = await fetch(url).then((resp) => {
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

export const useWebAuthn = () => {
	const webAuthnAttest = async (dispatch, data) => {
		try {
			dispatch({ type: 'WEBAUTHN_ATTEST_STARTED' });

			const {
				_embedded: {
					activation: { user, challenge, rp, attestation, pubKeyCredParams },
				},
				id: factorId,
			} = data || {};

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

			const attestationBin = CryptoUtil.binToStr(credential?.response?.attestationObject),
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

			if (!verification.ok) {
				throw new Error(`Unable to activate credential [${verification?.statusText}]`);
			}

			dispatch({ type: 'WEBAUTHN_ATTEST_SUCCEEDED' });
			return true;
		} catch (error) {
			console.error(`attestation error [${error}]`);
			throw error;
		}
	};

	const webAuthnAssert = async (dispatch, options) => {
		try {
			dispatch({ type: 'WEBAUTHN_ASSERT_STARTED' });

			const { userId, factors } = options;

			const user = userId ?? factors[0]?.userId;

			// get challenge from Okta
			const challenge = await getWebAuthnChallenge({
				...options,
				userId: user,
			});

			// Generate PublicKeyCredentialRequestOptions
			const publicKey = await generatePublicKeyRequest(challenge, options);

			// Do navigator.credentials.get()
			const assertion = await getWebAuthnAssertion(publicKey);

			const {
				_embedded: { enrolledFactors },
			} = challenge;

			// build Okta verify request
			const { request, factorId } = (await buildOktaRequest(assertion, enrolledFactors)) || {};

			// call Okta to verify assertion
			const result = await fetch(`${window.location.origin}/api/${user}/factors/${factorId}/verify`, request).then(
				(resp) => {
					if (resp.ok) {
						return resp.json();
					} else throw resp;
				}
			);

			console.debug('=== result ===');
			console.debug(result);

			dispatch({ type: 'WEBAUTHN_ASSERT_SUCCEEDED' });

			return { success: true };
		} catch (error) {
			let result = {
				success: false,
				code: 'WEBAUTHN_FAILED',
				error: error,
			};

			if (error?.name === 'NotAllowedError') {
				result.success = false;
				result.cancelled = true;
				result.code = 'WEBAUTHN_USER_CANCELLED';
				result.errorMessage = 'User cancelled or action not allowed';
			} else {
				dispatch({ type: result.code, error: error });
			}

			return result;

			// throw new Error(`useWebAuthn error [${error}]`);
		}
	};

	return {
		webAuthnAttest,
		webAuthnAssert,
	};
};
