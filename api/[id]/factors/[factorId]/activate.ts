/** @format */

import { VercelRequest, VercelResponse } from '@vercel/node';
import { activateFactor } from '../../../_utils';

const activate = (req: VercelRequest, res: VercelResponse) => activateFactor(req, res);

export default activate;
