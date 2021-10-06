/** @format */

const { client, ORG_URL } = require('./oktaClient');

const enrollFactor = (req, res) => {
	const userId = req.query?.id,
		body = req?.body;

	const url = `${ORG_URL}/api/v1/users/${userId}/factors`;
	// const url = 'https://ends9jz6b5wpg.x.pipedream.net';

	const request = {
		method: 'post',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: body,
	};

	return client.http
		.http(url, request)
		.then(resp => {
			if (resp.ok) {
				return resp.json();
			}
		})
		.then(resp => {
			return res.status(200).send(resp);
		})
		.catch(err => console.error(err));
};

module.exports = { enrollFactor };
