/** @format */
import { VercelRequest, VercelResponse } from '@vercel/node';
import { RequestOptions } from '@okta/okta-auth-js';

import { client, ORG_URL } from './oktaClient';
import { UserFactor } from '@okta/okta-sdk-nodejs';

type Factors = {
	type: string;
	name:
		| 'call'
		| 'email'
		| 'push'
		| 'question'
		| 'sms'
		| 'token:hardware'
		| 'token:hotp'
		| 'token:software:totp'
		| 'token'
		| 'u2f'
		| 'webauthn'
		| 'unknown';
	status: string;
	isRequired: boolean;
	provider: string;
};

interface OktaFactors extends UserFactor {
	enrollment?: string;
}

const getAvailableFactors = async (req: VercelRequest, res: VercelResponse) => {
	try {
		let factors: Factors[] = [];

		const {
			query: { id },
		} = req || {};

		const url = `${ORG_URL}/api/v1/users/${id}/factors/catalog`;

		const request: RequestInit = {
			method: 'get',
		};

		const response = await client.http.http(url, request as RequestOptions);

		let body: any;

		if (response.ok) {
			body = (await response.json()) as OktaFactors[];

			body.forEach(factor => {
				if (factor?.factorType === 'webauthn' || factor?.status === 'NOT_SETUP')
					factors.push({
						type: factor?.factorType as string,
						name: factorMap[factor?.factorType as string] ?? 'Unknown',
						status: factor?.status as string,
						isRequired: factor?.enrollment === 'REQUIRED' ? true : false,
						provider: factor?.provider as string,
					});
			});
			return res.status(response?.status).send(factors);
		} else {
			return res.status(response?.status).send(body);
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send(error);
	}
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

export default getAvailableFactors;
