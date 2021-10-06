/** @format */

const { client, ORG_URL } = require('./oktaClient');

const verifyFactor = (req, res) => {
	const userId = req?.query?.id,
		factorId = req?.query?.factorId,
		url = `${ORG_URL}/api/v1/users/${userId}/factors/${factorId}/verify`,
		request = {
			method: 'post',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		};

	return client.http
		.http(url, request)
		.then(resp => {
			if (resp.ok) {
				return resp.json();
			}
		})
		.then(resp => res.status(200).send(resp))
		.catch(err => console.error(err));
};

module.exports = { verifyFactor };
