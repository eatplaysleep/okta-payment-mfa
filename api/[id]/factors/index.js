/** @format */

// const okta = require('@okta/okta-sdk-nodejs');

// const API_KEY = process.env.API_OKTA_KEY;
// const CLIENT_ID = process.env.API_OKTA_CLIENT_ID;
// const ORG_URL = 'https://expedia-oie.dannyfuhriman.com';

// const client = new okta.Client({
// 	orgUrl: ORG_URL,
// 	token: API_KEY,
// });

const { getFactors } = require('../../../utils/getFactors');
const { enrollFactor } = require('../../../utils/enrollFactor');

module.exports = (req, res) => {
	const method = req?.method;

	switch (method) {
		case 'POST':
			console.log('enrolling factor...');
			return enrollFactor(req, res);
		case 'GET':
		default:
			return getFactors(req, res).then(resp => res.status(200).send(resp));
	}
};
