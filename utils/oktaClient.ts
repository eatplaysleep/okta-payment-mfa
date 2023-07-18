/** @format */

import * as okta from '@okta/okta-sdk-nodejs';

const { API_CLIENT_ID: CLIENT_ID, API_SCOPES = '', API_JWK: KEY, REACT_APP_OKTA_URL = '' } = process.env;

const SCOPES = API_SCOPES.split(' ');
const ORG_URLS = REACT_APP_OKTA_URL.split(' ');

export const ORG_URL = ORG_URLS.find((u) => u.split('.')[1] === window.location.host.split('.')[1]);

export const client = new okta.Client({
	orgUrl: ORG_URL,
	authorizationMode: 'PrivateKey',
	clientId: CLIENT_ID,
	scopes: SCOPES,
	privateKey: KEY,
});
