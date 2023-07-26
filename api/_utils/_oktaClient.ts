/** @format */

import { Client } from '@okta/okta-sdk-nodejs';

import type { VercelRequest } from '@vercel/node';

const { API_CLIENT_ID: CLIENT_ID, API_SCOPES = '', API_JWK: KEY, VITE_OKTA_URL = '' } = process.env;

const SCOPES = API_SCOPES.split(' ');
const ORG_URLS = VITE_OKTA_URL.split(' ');

export const getClient = (req: VercelRequest) => {
	const { headers } = req;

	const { host } = headers || {};

	if (!host) {
		throw new Error('Invalid incoming request');
	}

	const orgUrl = host.includes('localhost')
		? ORG_URLS[0]
		: ORG_URLS.find((u) => u.split('.')[1] === host.split('.')[1]);

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
