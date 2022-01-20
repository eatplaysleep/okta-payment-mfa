/** @format */
import base64url from 'base64url';
import { CryptoUtil } from '../utils';

const generatePublicKeyAttestationRequest = async ({ _embedded }) => {
	try {
		const {
			user,
			rp,
			attestation,
			pubKeyCredParams,
			// excludeCredentials,
			challenge,
		} = _embedded.activation;

		const publicKey = {
			attestation,
			authenticatorSelection: {
				authenticatorAttachment: 'platform',
				residentKey: 'required',
				requireResidentKey: true,
				userVerification: 'preferred',
			},
			challenge: CryptoUtil.strToBin(challenge),
			// excludeCredentials: excludeCredentials.map(credential => ({
			// 	...credential,
			// 	id: CryptoUtil.strToBin(credential.id),
			// })),
			pubKeyCredParams,
			rp,
			user: {
				...user,
				id: CryptoUtil.strToBin(user.id),
			},
		};

		console.debug('=== publicKey ===');
		console.debug(publicKey);

		return publicKey;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const generatePublicKeyAssertionRequest = async options => {
	try {
		const { discover, factor } = options;

		// get challenge from Okta
		const challenge = await getWebAuthnChallenge(options),
			{ _embedded } = challenge;

		// generate base publicKeyRequest
		let publicKey = {
			challenge: CryptoUtil.strToBin(_embedded.challenge.challenge),
			userVerification: 'required',
		};

		console.debug('discover:', discover ?? false);

		if (!discover) {
			publicKey = {
				...publicKey,
				allowCredentials: await generateAllowedCredentials(
					challenge?._embedded?.enrolledFactors,
					factor
				),
			};
		}

		console.debug('=== publicKey ===');
		console.debug(publicKey);

		return { publicKey, challenge };
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

const buildAssertionVerificationRequest = async (response, factorId) => {
	try {
		const { authenticatorData, clientDataJSON, signature, userHandle } =
			response;

		const _authenticatorData = CryptoUtil.binToStr(authenticatorData),
			_clientData = CryptoUtil.binToStr(clientDataJSON),
			_signatureData = CryptoUtil.binToStr(signature),
			body = {
				authenticatorData: _authenticatorData,
				clientData: _clientData,
				signatureData: _signatureData,
			},
			request = {
				method: 'post',
				body: JSON.stringify(body),
			};

		const _userHandle = CryptoUtil.binToStr(userHandle),
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

		return request;
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

const verifyAssertion = async ({ id, response }, { _embedded }, userId) => {
	try {
		// get Okta factorId
		const { enrolledFactors } = _embedded,
			factorId = await lookupOktaFactorId(enrolledFactors, id);

		// build Okta request
		const request = await buildAssertionVerificationRequest(response, factorId);

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

		return { success: true };
	} catch (error) {
		throw error;
	}
};

const getWebAuthnChallenge = async ({ userId, factor }) => {
	try {
		// get challenge from Okta

		const factorId = factor?.id ?? 'webauthn';

		if (userId) {
			let url = `${window.location.origin}/api/${userId}/factors`;

			if (factorId) {
				url = `${url}/${factorId}/verify`;
			}
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
	} catch (error) {
		throw error;
	}
};

export const useWebAuthn = () => {
	const webAuthnAttest = async (dispatch, factor) => {
		console.debug('enrolling WebAuthN...');

		try {
			// Generate PublicKeyCredentialRequestOptions
			const publicKey = await generatePublicKeyAttestationRequest(factor),
				factorId = factor.id,
				userId = factor._embedded.activation.user.id;

			// const _embedded = data?._embedded?.activation,
			// 	user = _embedded?.user,
			// 	factorId = data?.id,
			// 	challenge = _embedded?.challenge,
			// 	rp = _embedded?.rp,
			// 	attestation = _embedded?.attestation,
			// 	pubKeyCredParams = _embedded?.pubKeyCredParams;

			// let publicKey = {
			// 	status: data?.status,
			// 	challenge: CryptoUtil.strToBin(challenge),
			// 	rp: {
			// 		...rp,
			// 	},
			// 	user: {
			// 		...user,
			// 		id: CryptoUtil.strToBin(user.id),
			// 	},
			// 	attestation: attestation,
			// 	pubKeyCredParams: pubKeyCredParams,
			// 	authenticatorSelection: {
			// 		authenticatorAttachment: 'platform',
			// 		residentKey: 'required',
			// 		requireResidentKey: true,
			// 		userVerification: 'preferred',
			// 	},
			// };
			// console.debug('publicKey:', JSON.stringify(publicKey, null, 2));

			// create WebAuthn credential
			const credential = await navigator.credentials.create({ publicKey }),
				{ attestationObject, clientDataJSON } = credential;

			const attestationBin = CryptoUtil.binToStr(attestationObject),
				clientData = CryptoUtil.binToStr(clientDataJSON),
				requestData = {
					attestation: attestationBin,
					clientData: clientData,
				},
				url = `${window.location.origin}/api/${userId}/factors/${factorId}/activate`,
				options = {
					method: 'post',
					body: JSON.stringify(requestData),
				},
				extensionResults = credential.getClientExtensionResults();

			console.debug('===== extensionResults =====');
			console.debug(extensionResults);
			console.debug('===== credential =====');
			console.debug(credential);
			console.debug('===== clientDataJSON =====');
			console.debug(JSON.stringify(clientData, null, 2));

			const verification = await fetch(url, options);

			if (verification.ok) {
				return true;
			}
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
		}
	};

	const webAuthnAssert = async (dispatch, options) => {
		try {
			const userId = options?.factors[0]?.userId;

			// get challenge from Okta
			// const challenge = await getWebAuthnChallenge({
			// 	...options,
			// 	userId,
			// });

			// Generate PublicKeyCredentialRequestOptions
			const { publicKey, challenge } = await generatePublicKeyAssertionRequest({
				...options,
				userId,
			});

			// Do navigator.credentials.get()
			const assertion = await getWebAuthnAssertion(publicKey);

			// Verify assertion
			return await verifyAssertion(assertion, challenge, userId);

			// build Okta verify request
			// const { request, factorId } =
			// 	(await buildOktaRequest(
			// 		assertion,
			// 		challenge?._embedded?.enrolledFactors
			// 	)) || {};

			// // call Okta to verify assertion
			// const result = await fetch(
			// 	`${window.location.origin}/api/${userId}/factors/${factorId}/verify`,
			// 	request
			// ).then(resp => {
			// 	if (resp.ok) {
			// 		return resp.json();
			// 	} else throw resp;
			// });

			// console.debug('=== result ===');
			// console.debug(result);

			// return { success: true };
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
