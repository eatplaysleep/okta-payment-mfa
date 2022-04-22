/** @format */

import * as okta from '@okta/okta-sdk-nodejs';

const CLIENT_ID = process.env.API_CLIENT_ID;
const SCOPES = process.env.API_SCOPES.split(' ');
const KEY = process.env.API_JWK;

export const ORG_URL = process.env.REACT_APP_OKTA_URL;

export const client = new okta.Client({
	orgUrl: ORG_URL,
	authorizationMode: 'PrivateKey',
	clientId: CLIENT_ID,
	scopes: SCOPES,
	privateKey: KEY,
});
