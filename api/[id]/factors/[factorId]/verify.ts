/** @format */

import { verifyFactor } from '../../../../utils/verifyFactor';

const verify = (req, res) => verifyFactor(req, res);

export default verify;
