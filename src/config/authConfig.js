/** @format */

import { ORG_URL } from '../utils';

const {
	OKTA_TESTING_DISABLEHTTPSCHECK = false,
	REACT_APP_REDIRECT_URI: REDIRECT_URI = `${window.location.origin}/login/callback`,
	REACT_APP_OKTA_SCOPES: SCOPES,
	REACT_APP_OKTA_CLIENT_ID: CLIENT_ID,
	REACT_APP_OKTA_AUTH_SERVER_ID: AUTH_SERVER_ID,
} = process.env;

// const SCOPES = 'openid profile email';
// const CLIENT_ID = '0oa120pjs4hOYsSJx0h8';
const ISSUER = `${ORG_URL}/oauth2/${AUTH_SERVER_ID}`;
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
