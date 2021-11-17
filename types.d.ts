/** @format */

// import { Byte } from 'node-forge';
// import {
// 	ParsedAttestationObject,
// 	ParsedAuthenticatorData,
// } from './utils/webAuthn/models';

// declare var ParsedAuthenticatorAttestationResponse: {
// 	prototype: ParsedAuthenticatorAttestationResponse;
// 	new (): ParsedAuthenticatorAttestationResponse;
// };

// declare var ParsedAuthenticatorAssertionResponse: {
// 	prototype: ParsedAuthenticatorAssertionResponse;
// 	new (): ParsedAuthenticatorAssertionResponse;
// };

// declare var ParsedPublicKeyCredential: {
// 	prototype: ParsedPublicKeyCredential;
// 	new (): ParsedPublicKeyCredential;
// };

// declare global {
// ====================     AUTHENTICATOR      ==================== \\

// AuthenticatorData From §6.1 of the spec.
// The authenticator data structure encodes contextual bindings made by the authenticator. These bindings
// are controlled by the authenticator itself, and derive their trust from the WebAuthn Relying Party's
// assessment of the security properties of the authenticator. In one extreme case, the authenticator
// may be embedded in the client, and its bindings may be no more trustworthy than the client data.
// At the other extreme, the authenticator may be a discrete entity with high-security hardware and
// software, connected to the client over a secure channel. In both cases, the Relying Party receives
// the authenticator data in the same format, and uses its knowledge of the authenticator to make
// trust decisions.
//
// The authenticator data, at least during attestation, contains the Public Key that the RP stores
// and will associate with the user attempting to register.

// interface ParsedAttestationAuthData {
// 	readonly attestedCredentialData: ParsedAttestedCredentialData;
// 	extensions?: string;
// 	readonly flags: AuthenticatorFlags;
// 	// AuthenticatorFlags A byte of information returned during during ceremonies in the
// 	// authenticatorData that contains bits that give us information about the
// 	// whether the user was present and/or verified during authentication, and whether
// 	// there is attestation or extension data present. Bit 0 is the least significant bit.
// 	readonly rpIdHash: Buffer;
// 	signCount: number;
// }

// interface ParsedAttestedCredentialData {
// 	AAGUID: string;
// 	credentialId: Buffer;
// 	credentialIdLength: number;
// 	credentialPublicKey: ECJwk | RSAJwk;
// }

// interface ECJwk {
// 	kty: 'EC';
// 	crv: 'P-256';
// 	x: string;
// 	y: string;
// }

// interface RSAJwk {
// 	kty: 'RSA';
// 	n: string;
// 	e: string;
// }

// AuthenticatorFlags A byte of information returned during during ceremonies in the
// authenticatorData that contains bits that give us information about
// whether the user was present and/or verified during authentication, and whether
// there is attestation or extension data present. Bit 0 is the least significant bit.
// interface AuthenticatorFlags {
// 	// FlagUserPresent Bit 00000001 in the byte sequence. Tells us if user is present
// 	UP: boolean; // 'USER_PRESENT - Referred to as UP
// 	// FlagUserVerified Bit 00000100 in the byte sequence. Tells us if user is verified
// 	// by the authenticator using a biometric or PIN
// 	RFU1: boolean;
// 	UV: boolean; // 'USER_VERIFIED' - Referred to as UV
// 	// FlagAttestedCredentialData Bit 01000000 in the byte sequence. Indicates whether
// 	// the authenticator added attested credential data.
// 	RFU2a: boolean;
// 	RFU2b: boolean;
// 	RFU2c: boolean;
// 	AT: boolean; // 'ATTESTATION_CREDENTIAL_DATA' - Referred to as AT
// 	// FlagHasExtension Bit 10000000 in the byte sequence. Indicates if the authenticator data has extensions.
// 	ED: boolean; // 'HAS_EXTENSIONS' - Referred to as ED
// }

// enum AuthenticatorAttachmentEnum {
// 	'PLATFORM',
// 	'CROSS_PLATFORM',
// }

// enum AttestationPreference {
// 	'NONE',
// 	'DIRECT',
// 	'INDIRECT',
// }

// enum AuthenticatorTransportType {
// 	'BLE',
// 	'INTERNAL',
// 	'NFC',
// 	'USB',
// }

// ==================== AUTHENTICATOR RESPONSE ==================== \\

// Authenticators respond to Relying Party requests by returning an object derived from the
// AuthenticatorResponse interface. See §5.2. Authenticator Responses
// https://www.w3.org/TR/webauthn/#iface-authenticatorresponse
// interface AuthenticatorResponse {
// 	readonly clientDataJSON: ArrayBuffer;
// 	readonly attestationObject: ArrayBuffer;
// 	getPublicKey(): ArrayBuffer; // Returns a SubjectPublicKeyInfo as an ArrayBuffer
// 	getPublicKeyAlgorithm(): COSEAlgorithmIdentifier;
// }

// interface ParsedAuthenticatorResponse {
// 	// From the spec https://www.w3.org/TR/webauthn/#dom-authenticatorresponse-clientdatajson
// 	// This attribute contains a JSON serialization of the client data passed to the authenticator
// 	// by the client in its call to either create() or get().
// 	clientDataJSON: ParsedClientData;
// }

// interface ParsedAuthenticatorAssertionResponse
// 	extends ParsedAuthenticatorResponse {
// 	authenticatorData: ParsedAuthenticatorData;
// 	signature: Array<Byte>;
// 	userHandle?: Array<Byte>;
// }

// interface ParsedAuthenticatorAttestationResponse
// 	extends ParsedAuthenticatorResponse {
// 	readonly attestationObject: ParsedAttestationObject;
// }

// interface ParsedAttestationObject {
// 	authData: ParsedAttestationAuthData | Buffer;
// 	fmt: string;
// 	attStmt: AttestationStatement;
// }

// interface ParsedAttestationAuthData {
// 	readonly flags: number;
// 	readonly attestedCredentialData: ParsedAttestedCredentialData;
// 	extensions?: string;
// 	readonly rpIdHash: Buffer;
// 	signCount: number;
// }

interface AttestationStatement {
	sig: ArrayBuffer;
	x5c: ArrayBuffer;
}

// interface ParsedClientData {
// 	readonly challenge: string;
// 	// Chromium (Chrome) returns a hint sometimes about how to handle
// 	// clientDataJSON in a safe manner
// 	readonly hint: string;
// 	readonly origin: string;
// 	readonly tokenBindingId?: TokenBinding;
// 	readonly type: ClientDataType;
// }

// interface TokenBinding {
// 	readonly status: TokenBindingStatus;
// 	readonly id: string;
// }

// enum ClientDataType {
// 	'WEBAUTHN_CREATE',
// }

// ====================       CREDENTIAL       ==================== \\

// interface ParsedCredential {
// 	// ID is The credential’s identifier. The requirements for the
// 	// identifier are distinct for each type of credential. It might
// 	// represent a username for username/password tuples, for example.
// 	readonly id: string;
// 	// Type is the value of the object’s interface object's [[type]] slot,
// 	// which specifies the credential type represented by this object.
// 	// This should be type "public-key" for Webauthn credentials.
// 	readonly type: PublicKeyCredentialType;
// }

// The PublicKeyCredential interface extends Credential, and contains
//  the attributes that are returned to the caller when a new credential
// is created, or a new assertion is requested.
// interface ParsedPublicKeyCredential extends ParsedCredential {
// 	readonly rawId: ArrayBuffer;
// 	response:
// 		| ParsedAuthenticatorAttestationResponse
// 		| ParsedAuthenticatorAssertionResponse;
// 	authenticatorAttachment?: AuthenticatorAttachment;
// }

interface PublicKeyCredential extends Omit<Credential, 'type'> {
	readonly type: PublicKeyCredentialType;
	readonly rawId: ArrayBuffer;
	readonly response: AuthenticatorResponse;
}

interface PublicKeyRpEntity extends Omit<PublicKeyCredentialRpEntity, 'name'> {
	name?: string;
}

export interface PublicKeyCreateOptions
	extends Omit<PublicKeyCredentialCreationOptions, 'rp'> {
	rp: PublicKeyRpEntity;
}

// interface PublicKeyCredentialCreateResponse {
// 	factorType: FactorTypes;
// 	factorId: string;
// 	provider: ProviderTypes;
// 	status: FactorStatus;
// 	created: Date;
// 	lastUpdated: Date;
// 	activation: PublicKeyCredentialCreationOptions;
// }

// enum FactorTypes {
// 	'WEBAUTHN',
// }

// enum ProviderTypes {
// 	'FIDO',
// }

// enum FactorStatus {
// 	'PENDING_ACTIVATION',
// }
// }
