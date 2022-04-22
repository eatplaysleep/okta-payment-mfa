/** @format */
import { CryptoUtil } from '../utils';

interface RequestOptions {
	userId: string;
	factors?: OktaEnrolledFactor[];
	factor?: OktaEnrolledFactor;
	discover?: boolean;
}

interface OktaFactor extends Omit<OktaEnrolledFactor, 'profile'> {
	isRequired?: boolean;
	name: string;
	userId: string;
	device: OktaDeviceProfile;
}

type OktaDeviceProfile = {
	appId?: string;
	authenticatorName: string;
	credentialId: string;
	version?: string;
};

type OktaEmailProfile = {
	email: string;
};

type OktaSMSProfile = {
	phoneNumber: string;
};

type OktaEnrolledFactor = {
	id: string;
	vendorName: string;
	provider: string;
	status: string;
	factorType: string;
	profile: OktaDeviceProfile | OktaEmailProfile | OktaSMSProfile;
	userId?: string;
	lastUpdated?: string;
	created?: string;
	isRequired?: boolean;
};

type OktaChallenge = {
	challenge: string;
	extensions: {};
	userVerification: string;
};

type OktaChallengeEmbeddedResource = {
	challenge: OktaChallenge;
	enrolledFactors: OktaEnrolledFactor[];
};

interface OktaChallengeResponse {
	factorResult: string;
	profile: OktaDeviceProfile | OktaEmailProfile | OktaSMSProfile;
	_embedded: OktaChallengeEmbeddedResource;
}

const generatePublicKeyRequest = async (challenge: OktaChallengeResponse, options: RequestOptions) => {
	try {
		const { discover, factor } = options || {};

		const { _embedded: _embeddedChallenge } = challenge || {};

		const {
			challenge: { challenge: _oktaChallenge },
			enrolledFactors,
		} = _embeddedChallenge;

		let publicKey: PublicKeyCredentialRequestOptions = {
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

const generateAllowedCredentials = async (
	credentials: OktaEnrolledFactor[] = [],
	factor: OktaEnrolledFactor | undefined
) => {
	try {
		let allowCredentials: PublicKeyCredentialDescriptor[] = [];

		if (factor?.id) {
			credentials = [factor];
		}

		for (let i = 0; i < credentials.length; i++) {
			let credential = credentials[i];

			if (credential?.factorType === 'webauthn' && credential?.status === 'ACTIVE') {
				const profile = credential?.profile as OktaDeviceProfile;

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

const lookupOktaFactorId = async (credentials: OktaEnrolledFactor[] = [], _credentialId: string) => {
	try {
		const credential = credentials.find((factor) => {
			const profile = factor?.profile as OktaDeviceProfile;
			return profile?.credentialId === _credentialId;
		});

		return credential?.id;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

const buildOktaRequest = async (credential: PublicKeyCredential, credentials: OktaEnrolledFactor[]) => {
	try {
		const { id: _credentialId, response } = credential || {};

		const { clientDataJSON, authenticatorData, signature } = response as AuthenticatorAssertionResponse;

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

const getWebAuthnAssertion = async (publicKey: PublicKeyCredentialRequestOptions) => {
	try {
		const credential = (await navigator.credentials.get({ publicKey: publicKey })) as PublicKeyCredential;

		console.info(' ===== getWebAuthnAssertion() ===== ');
		console.info(credential);
		console.info('     ');

		return credential;
	} catch (error) {
		throw error;
	}
};

const getWebAuthnAttestation = async (publicKey: PublicKeyCredentialCreationOptions) => {
	try {
		const credential = await navigator.credentials.create({ publicKey });

		const { response } = credential as PublicKeyCredential;

		console.info(' ===== getWebAuthnAttestation() ===== ');
		console.info(credential);
		console.info('     ');

		return response as AuthenticatorAttestationResponse;
	} catch (error) {
		throw error;
	}
};

const getOktaChallenge = async (options: RequestOptions) => {
	const { userId, factor } = options || {};

	const { id = 'webauthn' } = factor || {};
	// get challenge from Okta
	if (userId) {
		const url = `${window.location.origin}/api/${userId}/factors/${id}/verify`;
		const challenge: OktaChallengeResponse = await fetch(url).then((resp) => {
			if (resp.ok) {
				return resp.json();
			} else throw resp;
		});

		console.info(' ===== getOktaChallenge() ===== ');
		console.info(challenge);
		console.info('     ');

		return challenge;
	} else {
		throw new Error('no userId provided!');
	}
};

interface OktaWebAuthnEnrollResponse {
	id: string;
	factorType: 'webauthn';
	provider: 'FIDO';
	vendorName: 'FIDO';
	status: 'PENDING_ACTIVATION';
	_embedded: {
		activation: OktaEnrollActivation;
	};
}

interface OktaEnrollActivation extends Omit<PublicKeyCredentialCreationOptions, 'challenge' | 'user'> {
	challenge: string;
	user: {
		displayName: string;
		name: string;
		id: string;
	};
}

const getOktaEnrollChallenge = async (userId: string): Promise<OktaWebAuthnEnrollResponse> => {
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

const generatePublicKeyCredentialCreationOptions = (
	options: OktaWebAuthnEnrollResponse
): PublicKeyCredentialCreationOptions => {
	const {
		_embedded: { activation },
	} = options || {};

	const { challenge, rp, attestation, pubKeyCredParams, user } = activation;

	const publicKey: PublicKeyCredentialCreationOptions = {
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

export const useWebAuthn = () => {
	/**
	 *
	 * Enroll WebAuthn Factor (Attest) via `navigator.credentials.create()`
	 *
	 * @param dispatch - AuthDispatcher
	 * @param userId - The Okta user `id`
	 * @returns
	 */
	const webAuthnAttest = async (dispatch: any, userId: string) => {
		try {
			dispatch({ type: 'WEBAUTHN_ATTEST_STARTED' });

			// 1) Enroll the factor with Okta to get a challenge
			const oktaResponse = await getOktaEnrollChallenge(userId);

			const { id: factorId } = oktaResponse || {};

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

			dispatch({ type: 'WEBAUTHN_ATTEST_SUCCEEDED' });
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
	 * @param {Object} dispatch - AuthDispatcher
	 * @param {RequestOptions} options
	 * @returns {Object} - Object contains 'success: true' if successful.
	 */
	const webAuthnAssert = async (dispatch: any, options: RequestOptions) => {
		try {
			dispatch({ type: 'WEBAUTHN_ASSERT_STARTED' });

			const { userId, factors = [] } = options;

			const user = userId || factors[0]?.userId;

			// 1) get challenge from Okta
			const challenge = await getOktaChallenge({
				...options,
				userId: user!,
			});

			// 2) Generate PublicKeyCredentialRequestOptions
			const publicKey = await generatePublicKeyRequest(challenge, options);

			// 3) Get the PublicKeyCredential
			const credential = await getWebAuthnAssertion(publicKey);

			const {
				_embedded: { enrolledFactors },
			} = challenge;

			// 4) Build Okta verification request
			const { request, factorId } = (await buildOktaRequest(credential, enrolledFactors)) || {};

			// 5) call Okta to verify assertion
			const result = await fetch(`${window.location.origin}/api/${user}/factors/${factorId}/verify`, request);

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

			dispatch({ type: 'WEBAUTHN_ASSERT_SUCCEEDED' });

			return { success: true };
		} catch (error: any) {
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
