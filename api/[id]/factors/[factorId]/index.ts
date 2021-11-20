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
			const response = await deleteFactor(req, res);

			return res.status(response?.status).send(await response.json());
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
};

export default index;
