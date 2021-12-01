/** @format */

import { removeNils, toQueryString } from '@okta/okta-auth-js';
import { httpRequest } from '../utils';

const validateOptions = options => {
	// Quick validation
	if (!options.clientId) {
		throw new Error(
			'A clientId must be specified in the OktaAuth constructor to get a token'
		);
	}

	if (!options.redirectUri) {
		throw new Error(
			'The redirectUri passed to /authorize must also be passed to /token'
		);
	}

	if (!options.authorizationCode && !options.interactionCode) {
		throw new Error(
			'An authorization code (returned from /authorize) must be passed to /token'
		);
	}

	if (!options.codeVerifier) {
		throw new Error(
			'The "codeVerifier" (generated and saved by your app) must be passed to /token'
		);
	}
};

const getPostData = (sdk, options) => {
	// Convert Token params to OAuth params, sent to the /token endpoint
	let params = removeNils({
		client_id: options.clientId,
		redirect_uri: options.redirectUri,
		grant_type: options.interactionCode
			? 'interaction_code'
			: 'authorization_code',
		code_verifier: options.codeVerifier,
	});

	if (options.interactionCode) {
		params['interaction_code'] = options.interactionCode;
	} else if (options.authorizationCode) {
		params.code = options.authorizationCode;
	}

	const { clientSecret } = sdk.options;
	if (clientSecret) {
		params['client_secret'] = clientSecret;
	}

	// Encode as URL string
	return toQueryString(params).slice(1);
};

export const postToTokenEndpoint = async (sdk, tokenParams) => {
	try {
		validateOptions(tokenParams);

		let data = getPostData(sdk, tokenParams);
		const tokenUrl =
			sdk?.options?.tokenUrl ?? `${sdk?.options?.issuer}/v1/token`;

		const headers = {
			'Content-Type': 'application/x-www-form-urlencoded',
		};

		return httpRequest(sdk, {
			url: tokenUrl,
			method: 'POST',
			args: data,
			withCredentials: true,
			headers,
		});
	} catch (error) {
		throw new Error(error);
	}
};
