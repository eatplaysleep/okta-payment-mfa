/** @format */

const OKTA_TESTING_DISABLEHTTPSCHECK =
	process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
const REDIRECT_URI = `${window.location.origin}/login/callback`;
const SCOPES = process.env.REACT_APP_OKTA_SCOPES;
const CLIENT_ID = process.env.REACT_APP_OKTA_CLIENT_ID;
const ISSUER = process.env.REACT_APP_OKTA_ISSUER;

// eslint-disable-next-line
export default {
	oidc: {
		clientId: CLIENT_ID,
		issuer: ISSUER,
		redirectUri: REDIRECT_URI,
		scopes: SCOPES.split(' '),
		pkce: true,
		tokenManager: {
			autoRenew: true,
		},
		disableHttpsCheck: OKTA_TESTING_DISABLEHTTPSCHECK,
	},
};
