/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { getFactors, enrollFactor } from '../../_utils';

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
