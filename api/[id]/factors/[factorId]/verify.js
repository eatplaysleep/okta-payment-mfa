/** @format */

const { verifyFactor } = require('../../../../utils/verifyFactor');

module.exports = (req, res) => verifyFactor(req, res);
