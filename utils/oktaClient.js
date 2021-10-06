/** @format */

const okta = require('@okta/okta-sdk-nodejs');

const API_KEY = process.env.API_OKTA_KEY;
const CLIENT_ID = process.env.API_OKTA_CLIENT_ID;
const ORG_URL = 'https://expedia-oie.dannyfuhriman.com';

const client = new okta.Client({
	orgUrl: ORG_URL,
	token: API_KEY,
});

module.exports = { client, ORG_URL };
