/** @format */

module.exports = (req, res) => {
	const method = req?.method;

	console.debug(method);

	if (method === 'POST') {
		// console.debug(req?.headers);
		const url = `${req?.headers['x-forwarded-proto']}://${req?.headers['x-forwarded-host']}/stepup/callback#id_token=${req?.body.id_token}`;
		return res.redirect(302, url);
	}
};
