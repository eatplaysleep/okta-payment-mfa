/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { deleteFactor, getAvailableFactors } from '../../../../utils';

const index = async (req: VercelRequest, res: VercelResponse) => {
	try {
		const {
			query: { factorId },
		} = req || {};

		if (factorId && factorId === 'catalog') {
			return getAvailableFactors(req, res);
		} else {
			return deleteFactor(req, res);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export default index;
