/** @format */

const { client, ORG_URL } = require('./oktaClient');

const getAvailableFactors = (req, res) => {
	const userId = req.query?.id;

	const url = `${ORG_URL}/api/v1/users/${userId}/factors/catalog`;

	const request = {
		method: 'get',
	};

	return client.http
		.http(url, request)
		.then(resp => {
			if (resp.ok) {
				return resp.json();
			}
		})
		.then(resp => {
			let factors = [];

			resp.forEach(factor => {
				if (factor?.factorType === 'webauthn' || factor?.status === 'NOT_SETUP')
					factors.push({
						type: factor?.factorType,
						name: factorMap[factor?.factorType] ?? 'Unknown',
						status: factor?.status,
						isRequired: factor?.enrollment === 'REQUIRED' ? true : false,
						provider: factor?.provider,
					});
			});

			return res.status(200).send(factors);
		})
		.catch(err => res.status(500).send(err));
};

const factorMap = {
	call: 'Call',
	email: 'Email',
	push: 'Okta Verify',
	question: 'Security Question',
	sms: 'SMS',
	'token:hardware': 'Hardware TOTP',
	'token:hotp': 'Custom HOTP',
	'token:software:totp': 'Software TOTP',
	token: 'OTP Device/Application',
	u2f: 'Hardware U2F',
	webauthn: 'WebAuthN',
};

module.exports = { getAvailableFactors };
