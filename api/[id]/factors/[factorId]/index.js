/** @format */

const { deleteFactor } = require('../../../../utils/deleteFactor');
const {
	getAvailableFactors,
} = require('../../../../utils/getAvailableFactors');

module.exports = (req, res) => {
	if (req?.query?.factorId === 'catalog') {
		return getAvailableFactors(req, res);
	} else deleteFactor(req, res).then(resp => res.status(200).send(resp));
};
