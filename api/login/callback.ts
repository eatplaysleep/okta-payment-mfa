/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';

const index = (req: VercelRequest, res: VercelResponse) => {
	const {
		method,
		headers,
		body: { id_token },
	} = req || {};

	console.debug(method);

	if (method === 'POST') {
		// console.debug(req?.headers);
		const url = `${headers['x-forwarded-proto']}://${headers['x-forwarded-host']}/stepup/callback#id_token=${id_token}`;
		return res.redirect(302, url);
	}
};

export default index;
