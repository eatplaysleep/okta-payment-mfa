/** @format */

// const okta = require('@okta/okta-sdk-nodejs');

// const API_KEY = process.env.API_OKTA_KEY;
// const CLIENT_ID = process.env.API_OKTA_CLIENT_ID;
// const ORG_URL = 'https://expedia-oie.dannyfuhriman.com';

// const client = new okta.Client({
// 	orgUrl: ORG_URL,
// 	token: API_KEY,
// });

import { VercelRequest, VercelResponse } from '@vercel/node';
import { getFactors, enrollFactor } from '../../../utils';

const index = (req: VercelRequest, res: VercelResponse) => {
	try {
		const { method } = req || {};

		switch (method) {
			case 'POST':
				console.debug('enrolling factor...');
				return enrollFactor(req, res);
			case 'GET':
			default:
				return getFactors(req, res);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export default index;
