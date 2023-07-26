/** @format */

import { UserFactor } from '@okta/okta-sdk-nodejs';
import { Response } from 'node-fetch';

export const parseFactors = async (res: Response, filter?: { status: string; type: string }): Promise<Factor[]> => {
	try {
		if (res.ok) {
			const url = new URL(res.url),
				paths = url.pathname.split('/'),
				userId = paths[paths.indexOf('users') + 1],
				body = (await res.json()) as OktaFactor[];

			let factors: Factor[] = [];

			body.forEach((factor) => {
				let resp: Factor = {
					userId: userId,
					name: factorMap[factor?.factorType as keyof FactorMap] ?? 'Unknown',
					isRequired: factor?.enrollment === 'REQUIRED' ? true : false,
					...factor,
				};

				delete resp._links;

				if (filter) {
					if (factor?.factorType === filter?.type || factor?.status === filter?.status) {
						factors.push(resp);
					}
				} else {
					factors.push(resp);
				}
			});

			return factors;
		} else {
			throw new Error(`Response not ok! [${res}]`);
		}
	} catch (error) {
		console.error(error);
		throw error;
	}
};

interface Factor extends Omit<OktaFactor, '_links'> {
	userId: string;
	id: string;
	name: FactorType;
	isRequired: boolean;
	_links?: { [name: string]: unknown };
}

interface OktaFactor extends Omit<UserFactor, 'delete'> {
	enrollment?: string;
	profile?: {
		credentialId: string;
		authenticatorName: string;
	};
}

type FactorMap = {
	[key in FactorKey]: FactorType;
};

type FactorKey =
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

type FactorType =
	| 'Voice'
	| 'Email'
	| 'Okta Verify'
	| 'Security Question'
	| 'SMS'
	| 'Hardware TOTP'
	| 'Custom HOTP'
	| 'Software TOTP'
	| 'OTP Device/Application'
	| 'Hardware U2F'
	| 'Unknown'
	| 'WebAuthN';

const factorMap: FactorMap = {
	call: 'Voice',
	email: 'Email',
	push: 'Okta Verify',
	question: 'Security Question',
	sms: 'SMS',
	'token:hardware': 'Hardware TOTP',
	'token:hotp': 'Custom HOTP',
	'token:software:totp': 'Software TOTP',
	token: 'OTP Device/Application',
	u2f: 'Hardware U2F',
	unknown: 'Unknown',
	webauthn: 'WebAuthN',
};
