/** @format */
/*!
 * Copyright (c) 2015-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

import {
	STATE_TOKEN_KEY_NAME,
	DEFAULT_CACHE_DURATION,
	clone,
	isString,
	removeNils,
} from '@okta/okta-auth-js';

export const httpRequest = async (sdk, options) => {
	try {
		options = options || {};

		let url = options?.url,
			method = options?.method,
			args = options?.args,
			saveAuthnState = options?.saveAuthnState,
			accessToken = options?.accessToken,
			withCredentials = options?.withCredentials ?? false, // default value is false
			storageUtil = sdk?.options?.storageUtil,
			storage = storageUtil?.storage,
			httpCache = sdk?.storageManager?.getHttpCache(sdk?.options?.cookies);

		if (options?.cacheResponse) {
			let cacheContents = httpCache?.getStorage();
			let cachedResponse = cacheContents[url];
			if (cachedResponse && Date.now() / 1000 < cachedResponse?.expiresAt) {
				return Promise.resolve(cachedResponse?.response);
			}
		}

		let oktaUserAgentHeader = sdk?._oktaUserAgent.getHttpHeader();
		let headers = {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			...oktaUserAgentHeader,
		};
		Object.assign(headers, sdk?.options?.headers, options?.headers);
		headers = removeNils(headers);

		if (accessToken && isString(accessToken)) {
			headers['Authorization'] = 'Bearer ' + accessToken;
		}

		let ajaxOptions = {
			headers,
			data: args || undefined,
			withCredentials,
		};

		let err, res;
		return sdk?.options
			.httpRequestClient(method, url, ajaxOptions)
			.then(resp => {
				res = resp.responseText;
				if (res && isString(res)) {
					res = JSON.parse(res);
					if (res && typeof res === 'object' && !res.headers) {
						res.headers = resp.headers;
					}
				}

				if (saveAuthnState) {
					if (!res.stateToken) {
						storage.delete(STATE_TOKEN_KEY_NAME);
					}
				}

				if (res && res.stateToken && res.expiresAt) {
					storage.set(
						STATE_TOKEN_KEY_NAME,
						res.stateToken,
						res.expiresAt,
						sdk.options.cookies
					);
				}

				if (res && options.cacheResponse) {
					httpCache.updateStorage(url, {
						expiresAt: Math.floor(Date.now() / 1000) + DEFAULT_CACHE_DURATION,
						response: res,
					});
				}

				return res;
			})
			.catch(resp => {
				let serverErr = resp?.responseText || {};
				if (isString(serverErr)) {
					try {
						serverErr = JSON.parse(serverErr);
					} catch (e) {
						serverErr = {
							errorSummary: 'Unknown error',
						};
					}
				}

				if (resp?.status >= 500) {
					serverErr.errorSummary = 'Unknown error';
				}

				if (sdk?.options?.transformErrorXHR) {
					resp = sdk.options.transformErrorXHR(clone(resp));
				}

				err = new Error(serverErr, resp);

				if (err.errorCode === 'E0000011') {
					storage.delete(STATE_TOKEN_KEY_NAME);
				}

				throw err;
			});
	} catch (error) {
		console.error(`httpRequest error [${JSON.stringify(error, null, 2)}]`);
		throw new Error(error);
	}
};
