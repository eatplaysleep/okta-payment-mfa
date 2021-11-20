/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { RequestOptions } from '@okta/okta-auth-js';

import { client, ORG_URL } from '../utils';

export const activateFactor = async (
	req: VercelRequest,
	res: VercelResponse
) => {
	try {
		const {
				query: { id, factorId },
				body,
			} = req || {},
			url = `${ORG_URL}/api/v1/users/${id}/factors/${factorId}/lifecycle/activate`,
			request: RequestInit = {
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
