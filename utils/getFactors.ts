/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { RequestOptions } from '@okta/okta-auth-js';

import { client, ORG_URL, parseFactors } from '../utils';

export const getFactors = async (req: VercelRequest, res: VercelResponse) => {
	try {
		const {
			query: { id },
		} = req || {};

		const url = `${ORG_URL}/api/v1/users/${id}/factors`;

		const request: RequestInit = {
			method: 'get',
		};

		const response = await client.http.http(url, request as RequestOptions);

		return res.status(response?.status).send(await parseFactors(response));
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};
