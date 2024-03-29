/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { RequestOptions } from '@okta/okta-auth-js';

import { getClient } from '.';

export const deleteFactor = async (req: VercelRequest, res: VercelResponse) => {
	try {
		const { client, orgUrl } = getClient(req);

		const {
			query: { id, factorId },
		} = req || {};

		console.debug('deleting factor id', factorId);

		const url = `${orgUrl}/api/v1/users/${id}/factors/${factorId}`;

		const request: RequestInit = {
			method: 'delete',
		};

		const response = await client.http.http(url, request as RequestOptions);

		if (response?.status === 204) {
			return res.status(response?.status).send('');
		}

		return res.status(response?.status).send(await response.json());
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};
