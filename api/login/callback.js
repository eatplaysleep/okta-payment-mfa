/** @format */

module.exports = (req, res) => {
	const method = req?.method;

	console.debug(method);

	if (method === 'POST') {
		const url = `http://${req?.headers['x-vercel-deployment-url']}/stepup/callback#id_token=${req?.body.id_token}`;
		return res.redirect(302, url);
	}
};
