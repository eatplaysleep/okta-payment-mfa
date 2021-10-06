/** @format */

const { client, ORG_URL } = require('./oktaClient');
const { getFactors } = require('./getFactors');

const deleteFactor = (req, res) => {
	const userId = req.query?.id,
		factorId = req.query?.factorId;

	console.log('deleting factor id', factorId);

	const url = `${ORG_URL}/api/v1/users/${userId}/factors/${factorId}`;

	const request = {
		method: 'delete',
	};

	return client.http
		.http(url, request)
		.then(resp => {
			if (resp.ok) {
				res.status(204);
			}
		})
		.catch(err => res.send(500).send(err));
};

module.exports = { deleteFactor };
