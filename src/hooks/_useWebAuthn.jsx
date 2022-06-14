import { CryptoUtil } from '../utils';

const generatePublicKeyRequest = async (challenge, options) => {
	try {
		// const { discover, factor } = options || {};
		const discover = options?.discover;
		const factor = options?.factor;

		// const { _embedded: _embeddedChallenge } = challenge || {};

		// const {
		// 	challenge: { challenge: _oktaChallenge },
		// 	enrolledFactors,
		// } = _embeddedChallenge;
		const _oktaChallenge = challenge?._embedded?.challenge?.challenge;
		const enrolledFactors = challenge?._embedded?.enrolledFactors;

		let publicKey = {
			challenge: CryptoUtil.strToBin(_oktaChallenge),
			userVerification: 'required',
		};

		if (!discover) {
			publicKey = {
				...publicKey,
				allowCredentials: await generateAllowedCredentials(enrolledFactors, factor),
			};
		}

		console.info(' ===== generatePublicKeyRequest() ===== ');
		console.info(publicKey);
		console.info('     ');

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

			if (credential?.factorType === 'webauthn' && credential?.status === 'ACTIVE') {
				const profile = credential?.profile;

				allowCredentials.push({
					id: CryptoUtil.strToBin(profile?.credentialId),
					type: 'public-key',
				});
			}
		}

		console.info(' ===== generateAllowedCredentials() ===== ');
		console.info(allowCredentials);
		console.info('     ');

		return allowCredentials;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const lookupOktaFactorId = async (credentials = [], _credentialId) => {
	try {
		const credential = credentials.find((factor) => {
			const profile = factor?.profile;
			return profile?.credentialId === _credentialId;
		});

		return credential?.id;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const buildOktaRequest = async (credential, credentials) => {
	try {
		const { id: _credentialId, response } = credential || {};

		const { clientDataJSON, authenticatorData, signature } = response;

		const factorId = await lookupOktaFactorId(credentials, _credentialId);
		const body = {
			authenticatorData: CryptoUtil.binToStr(authenticatorData),
			clientData: CryptoUtil.binToStr(clientDataJSON),
			signatureData: CryptoUtil.binToStr(signature),
		};
		const request = {
			method: 'post',
			body: JSON.stringify(body),
		};

		console.info(' ===== buildOktaRequest() ===== ');
		console.info(request);
		console.info('     ');

		return { request, factorId };
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const getWebAuthnAssertion = async (publicKey) => {
	try {
		const credential = await navigator.credentials.get({ publicKey: publicKey });

		console.info(' ===== getWebAuthnAssertion() ===== ');
		console.info(credential);
		console.info('     ');

		return credential;
	} catch (error) {
		throw error;
	}
};

const getWebAuthnAttestation = async (publicKey) => {
	try {
		const credential = await navigator.credentials.create({ publicKey });

		const { response } = credential;

		console.info(' ===== getWebAuthnAttestation() ===== ');
		console.info(credential);
		console.info('     ');

		return response;
	} catch (error) {
		throw error;
	}
};

const getOktaChallenge = async (options) => {
	// const { userId, factor } = options || {};
	const userId = options?.userId;
	const factor = options?.factor;

	// const { id = 'webauthn' } = factor || {};
	const id = factor || 'webauthn';

	// get challenge from Okta
	if (userId) {
		const url = `${window.location.origin}/api/${userId}/factors/${id}/verify`;
		const challenge = await fetch(url);

		if (!challenge.ok) {
			throw challenge;
		}

		console.info(' ===== getOktaChallenge() ===== ');
		console.info(challenge);
		console.info('     ');

		return await challenge.json();
	} else {
		throw new Error('no userId provided!');
	}
};

const getOktaEnrollChallenge = async (userId) => {
	const url = `${window.location.origin}/api/${userId}/factors`;

	const request = {
		factorType: 'webauthn',
		provider: 'FIDO',
	};

	const response = await fetch(url, { method: 'post', body: JSON.stringify(request) });

	if (!response.ok) {
		throw response;
	}

	const body = await response.json();

	console.info(' ===== getOktaEnrollChallenge() ===== ');
	console.info(body);
	console.info('     ');

	return body || {};
};

const generatePublicKeyCredentialCreationOptions = (options) => {
	// const {
	// 	_embedded: { activation },
	// } = options || {};

	// const { challenge, rp, attestation, pubKeyCredParams, user } = activation;
	const challenge = options?._embedded?.activation?.challenge;
	const rp = options?._embedded?.activation?.rp;
	const attestation = options?._embedded?.activation?.attestation;
	const pubKeyCredParams = options?._embedded?.activation?.pubKeyCredParams;
	const user = options?._embedded?.activation?.user;

	const publicKey = {
		challenge: CryptoUtil.strToBin(challenge),
		rp,
		user: {
			...user,
			id: CryptoUtil.strToBin(user.id),
		},
		attestation,
		pubKeyCredParams,
		authenticatorSelection: {
			authenticatorAttachment: 'platform',
			residentKey: 'required',
			requireResidentKey: true,
			userVerification: 'preferred',
		},
	};

	console.info(' ===== generatePublicKeyCredentialCreationOptions() ===== ');
	console.info(publicKey);
	console.info('     ');

	return publicKey;
};

/**
 *
 * Enroll WebAuthn Factor (Attest) via `navigator.credentials.create()`
 *
 * @param userId - The Okta user `id`
 * @returns
 */
const webAuthnAttest = async (userId) => {
	try {
		// 1) Enroll the factor with Okta to get a challenge
		const oktaResponse = await getOktaEnrollChallenge(userId);

		// const { id: factorId } = oktaResponse || {};
		const factorId = oktaResponse?.id;

		// 2) Build the PublicKeyCredentialCreationOptions
		const publicKey = await generatePublicKeyCredentialCreationOptions(oktaResponse);

		// 3) Get/Generate the PublicKeyCredential data;
		const { attestationObject, clientDataJSON } = await getWebAuthnAttestation(publicKey);

		const requestData = {
			attestation: CryptoUtil.binToStr(attestationObject),
			clientData: CryptoUtil.binToStr(clientDataJSON),
		};

		// 4) Call Okta to activate the factor
		const url = `${window.location.origin}/api/${userId}/factors/${factorId}/activate`;

		const options = {
			method: 'post',
			body: JSON.stringify(requestData),
		};

		const verification = await fetch(url, options);

		if (!verification.ok) {
			throw new Error(`Unable to activate credential ${factorId}`);
		}

		return true;
	} catch (error) {
		console.error(`attestation error [${error}]`);
		throw error;
	}
};

/**
 *
 * Issue WebAuthn Challenge (Assert) via `navigator.credentials.get()`
 *
 * @param {RequestOptions} options
 * @returns {Object} - Object contains 'success: true' if successful.
 */
const webAuthnAssert = async (options) => {
	try {
		// const { userId, factors = [] } = options;
		const factors = options?.factors || [];

		// const user = userId || factors[0]?.userId;
		const userId = options?.userId || factors[0]?.userId;

		// 1) get challenge from Okta
		const challenge = await getOktaChallenge({
			...options,
			// userId: user,
			userId,
		});

		// 2) Generate PublicKeyCredentialRequestOptions
		const publicKey = await generatePublicKeyRequest(challenge, options);

		// 3) Get the PublicKeyCredential
		const credential = await getWebAuthnAssertion(publicKey);

		// const {
		// 	_embedded: { enrolledFactors },
		// } = challenge;
		const enrolledFactors = challenge?._embedded;

		// 4) Build Okta verification request
		// const { request, factorId } = (await buildOktaRequest(credential, enrolledFactors)) || {};
		const oktaRequest = await buildOktaRequest(credential, enrolledFactors);
		const request = oktaRequest?.request;
		const factorId = oktaRequest?.factorId;

		// 5) call Okta to verify assertion
		const result = await fetch(`${window.location.origin}/api/${userId}/factors/${factorId}/verify`, request);

		if (!result.ok) {
			throw result;
		}

		console.info(' ===== OktaVerifyResponse ===== ');
		console.info({
			status: result?.status,
			statusText: result?.statusText,
			body: (await result.json()) || {},
		});
		console.info('     ');

		return { success: true };
	} catch (error) {
		let result = {
			success: false,
			code: 'WEBAUTHN_FAILED',
			error: error,
			cancelled: false,
			errorMessage: '',
		};

		if (error?.name === 'NotAllowedError') {
			result.success = false;
			result.cancelled = true;
			result.code = 'WEBAUTHN_USER_CANCELLED';
			result.errorMessage = 'User cancelled or action not allowed';
		}

		return result;
	}
};

// To enroll
// webAuthnAttest(userId)

// To verify
// webAuthnAssert({userId: <userId>, factors: <factors> })
