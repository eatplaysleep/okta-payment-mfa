/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_OKTA_AUTH_SERVER_ID: string;
	readonly VITE_OKTA_CLIENT_ID: string;
	/**
	 * @readonly
	 * Space-delimited string of valid scopes to be requested during authorization.
	 */
	readonly VITE_OKTA_SCOPES?: string;
	readonly VITE_OKTA_TESTING_DISABLEHTTPSCHECK?: boolean;
	readonly VITE_OKTA_URL?: string;
	/**
	 * @readonly
	 * Space-delimited string of allowed origins.
	 */
	readonly VITE_ORIGIN?: string;
	/**
	 * @readonly
	 * @defaultValue `${window.location.origin}
	 */
	readonly VITE_REDIRECT_URI?: string;
	/**
	 * @readonly
	 * Space-delimited string of allowed origins for step-up authorization.
	 *
	 * Used to establish security between parent/top app and iFrame.
	 */
	readonly VITE_STEP_UP_ALLOW?: string;
	/**
	 * @readonly
	 * Required variable for vite-plugin-vercel
	 *
	 * Should be `1`
	 */
	readonly ENABLE_VC_BUILD: number;
}
