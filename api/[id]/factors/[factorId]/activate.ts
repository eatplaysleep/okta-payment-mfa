/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { activateFactor } from '../../../../utils';

const activate = (req: VercelRequest, res: VercelResponse) =>
	activateFactor(req, res);

export default activate;
