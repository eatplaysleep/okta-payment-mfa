/** @format */

import { Client } from '@okta/okta-sdk-nodejs';

import type { VercelRequest } from '@vercel/node';

const { API_CLIENT_ID: CLIENT_ID, API_SCOPES = '', API_JWK: KEY, REACT_APP_OKTA_URL = '' } = process.env;

const SCOPES = API_SCOPES.split(' ');
const ORG_URLS = REACT_APP_OKTA_URL.split(' ');

export const getClient = (req: VercelRequest) => {
	const { url } = req;

	if (!url) {
		throw new Error('Invalid incoming request');
	}

	const { host } = new URL(url);

	const orgUrl = ORG_URLS.find((u) => u.split('.')[1] === host.split('.')[1]);

	if (!orgUrl) {
		throw new Error('Unable to parse Okta org URL. Invalid request.');
	}

	const client = new Client({
		orgUrl,
		authorizationMode: 'PrivateKey',
		clientId: CLIENT_ID,
		scopes: SCOPES,
		privateKey: KEY,
	});

	return { client, orgUrl };
};
