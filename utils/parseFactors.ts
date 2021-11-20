/** @format */

import { UserFactor } from '@okta/okta-sdk-nodejs';
import { Response } from 'node-fetch';

type FactorDevice = {
	id: string;
	type?: string;
};
type Factor = {
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
	device?: FactorDevice;
};

interface OktaFactor extends UserFactor {
	enrollment?: string;
	profile?: {
		credentialId: string;
		authenticatorName: string;
	};
}

export const parseFactors = async (
	res: Response,
	filter?: { status: string; type: string }
): Promise<Factor[]> => {
	try {
		if (res.ok) {
			const body = (await res.json()) as OktaFactor[];

			let factors: Factor[] = [];

			body.forEach(factor => {
				let resp: Factor = {
					type: factor?.factorType as string,
					name: factorMap[factor?.factorType as string] ?? 'Unknown',
					status: factor?.status as string,
					isRequired: factor?.enrollment === 'REQUIRED' ? true : false,
					provider: factor?.provider as string,
					device: {
						id: factor?.profile?.credentialId,
						type: factor?.profile?.authenticatorName,
					},
				};

				if (filter) {
					if (
						factor?.factorType === filter?.type ||
						factor?.status === filter?.status
					) {
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
