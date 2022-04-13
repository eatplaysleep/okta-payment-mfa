/** @format */
import base64url from 'base64url';
import { CryptoUtil } from '../utils';

const generatePublicKeyRequest = async (challenge, { discover, factor }) => {
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
				allowCredentials: await generateAllowedCredentials(_embedded?.enrolledFactors, factor),
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
		const _authenticatorData = CryptoUtil.binToStr(assertion?.response?.authenticatorData),
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

const getWebAuthnChallenge = async ({ userId, factor }) => {
	const factorId = factor?.factorId ?? 'webauthn';

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

			if (verification.ok) {
				return true;
			}
		} catch (error) {
			console.error(`attestation error [${error}]`);
			throw error;
		}
	};

	const webAuthnAssert = async (dispatch, options) => {
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
			const { request, factorId } = (await buildOktaRequest(assertion, challenge?._embedded?.enrolledFactors)) || {};

			// call Okta to verify assertion
			const result = await fetch(`${window.location.origin}/api/${userId}/factors/${factorId}/verify`, request).then(
				(resp) => {
					if (resp.ok) {
						return resp.json();
					} else throw resp;
				}
			);

			console.debug('=== result ===');
			console.debug(result);

			return { success: true };
		} catch (error) {
			let result = {
				success: false,
				code: 'WEBAUTHN_ERROR',
				error: error,
			};

			if (error?.name === 'NotAllowedError') {
				result.success = false;
				result.code = 'USER_CANCELLED';
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
