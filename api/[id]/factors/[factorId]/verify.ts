/** @format */

import { verifyFactor } from '../../../_utils';

import type { VercelRequest, VercelResponse } from '@vercel/node';

const verify = (req: VercelRequest, res: VercelResponse) => verifyFactor(req, res);

export default verify;
