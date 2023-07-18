/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { RequestOptions } from '@okta/okta-auth-js';

import { getClient } from './_oktaClient';

export const enrollFactor = async (req: VercelRequest, res: VercelResponse) => {
	try {
		const { client, orgUrl } = getClient(req);

		const {
			query: { id },
			body,
		} = req || {};

		const url = `${orgUrl}/api/v1/users/${id}/factors`;
		// const url = 'https://ends9jz6b5wpg.x.pipedream.net';

		const request: RequestInit = {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: body,
		};

		const response = await client.http.http(url, request as RequestOptions);

		return res.status(response?.status).send(await response.json());
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};
