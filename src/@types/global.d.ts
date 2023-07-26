import type { UserFactor } from '@okta/okta-sdk-nodejs';

declare global {
	interface Factor extends Omit<OktaFactor, 'factorType', '_links'> {
		userId: string;
		id: string;
		name: FactorType;
		isRequired: boolean;
		factorType: FactorKey;
		_links?: { [name: string]: unknown };
	}

	interface OktaFactor extends Omit<UserFactor, 'delete'> {
		enrollment?: string;
		profile?: {
			credentialId: string;
			authenticatorName: string;
		};
	}

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
}

export {};
