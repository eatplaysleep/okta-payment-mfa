/** @format */

import { activateFactor } from '../../../_utils';

import type { VercelRequest, VercelResponse } from '@vercel/node';

const activate = (req: VercelRequest, res: VercelResponse) => activateFactor(req, res);

export default activate;
