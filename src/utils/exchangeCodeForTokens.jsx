/** @format */

import {
	getOAuthUrls,
	getDefaultTokenParams,
	clone,
	handleOAuthResponse,
} from '@okta/okta-auth-js';
import { postToTokenEndpoint } from '../utils';

// codeVerifier is required. May pass either an authorizationCode or interactionCode
export const exchangeCodeForTokens = async (sdk, tokenParams) => {
	try {
		let urls = getOAuthUrls(sdk, tokenParams);
		// build params using defaults + options
		tokenParams = Object.assign(
			{},
			getDefaultTokenParams(sdk),
			clone(tokenParams)
		);

		const {
			authorizationCode,
			interactionCode,
			codeVerifier,
			clientId,
			redirectUri,
			scopes,
			ignoreSignature,
			state,
		} = tokenParams || {};
		let getTokenOptions = {
			clientId,
			redirectUri,
			authorizationCode,
			interactionCode,
			codeVerifier,
		};

		const oAuthResponse = await postToTokenEndpoint(sdk, getTokenOptions, urls);
		// `handleOAuthResponse` handles responses from both `/authorize` and `/token` endpoints
		// Here we modify the response from `/token` so that it more closely matches a response from `/authorize`
		// `responseType` is used to validate that the expected tokens were returned
		const responseType = ['token']; // an accessToken will always be returned
		if (scopes.indexOf('openid') !== -1) {
			responseType.push('id_token'); // an idToken will be returned if "openid" is in the scopes
		}
		const handleResponseOptions = {
			clientId,
			redirectUri,
			scopes,
			responseType,
			ignoreSignature,
		};
		let response = await handleOAuthResponse(
			sdk,
			handleResponseOptions,
			oAuthResponse,
			urls
		);

		// For compatibility, "code" is returned in the TokenResponse. OKTA-326091
		response.code = authorizationCode;
		response.state = state;

		sdk.transactionManager.clear();

		return response;
	} catch (error) {
		throw new Error(error);
	}
};
