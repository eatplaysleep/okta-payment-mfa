/** @format */

const OKTA_TESTING_DISABLEHTTPSCHECK =
	process.env.OKTA_TESTING_DISABLEHTTPSCHECK || false;
const REDIRECT_URI = `${window.location.origin}/login/callback`;
const SCOPES = process.env.REACT_APP_OKTA_SCOPES;
// const SCOPES = 'openid profile email';
const CLIENT_ID = process.env.REACT_APP_OKTA_CLIENT_ID;
// const CLIENT_ID = '0oa120pjs4hOYsSJx0h8';
const ISSUER = process.env.REACT_APP_OKTA_ISSUER;
// const ISSUER = 'https://expedia.dannyfuhriman.com/oauth2/default';
// const ISSUER = 'https://udp-expedia-oie.oktapreview.com/oauth2/aus1gb3zbtlqNoCUK1d7';

// eslint-disable-next-line
export const authConfig = {
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
