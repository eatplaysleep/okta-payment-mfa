/* eslint-disable no-fallthrough */
/** @format */

import * as _ from 'lodash';

const initialLoginState = {
	isLoadingLogin: false,
	isVisibleAuthModal: false,
	isVisibleIframe: false,
	isLoadingStepUp: false,
};

export const initialState = {
	isAuthenticated: false,
	isFido: false,
	// isLoading == general 'is busy' indicator that locks the entire app with a loading overlay
	isLoading: false,
	isLoadingStepUp: false,
	isLoadingFactors: false,
	isLoadingFactorCatalog: false,
	isLoadingLogout: false,
	isLoadingProfile: false,
	isVisibleFactorDialog: false,
	// isStaleFactors == if 'true', fetch new factors
	isStaleFactors: false,
	isStaleUser: false,
	isStepUpRequired: false,

	errors: [],
	...initialLoginState,
};

export const AuthReducer = (state, action) => {
	// console.debug('======= current state =======');
	// console.debug(JSON.stringify(state, null, 2));
	console.debug('=======    dispatch     =======');
	console.debug(JSON.stringify(action, null, 2));
	try {
		// reset the temp state
		let tempState = {};

		switch (action.type) {
			case 'MFA_ISSUE_STARTED':
				tempState = { isLoadingLogin: true };
				return { ...state, ...tempState, ...action?.payload };

			case 'MFA_ISSUE_USER_CANCELLED':
			case 'MFA_ISSUE_SUCCEEDED':
				tempState = { ...initialLoginState, isLoadingFactors: false, isStaleFactors: false };
				return { ...state, ...tempState, ...action?.payload };

			// FACTOR ENROLLMENT
			case 'FACTOR_ENROLL_DIALOG_TOGGLED':
			case 'FACTOR_ENROLL_STARTED':
				tempState = { isLoading: true, isVisibleFactorDialog: false };
				return { ...state, ...tempState, ...action?.payload };

			case 'FACTOR_ENROLL_SUCCEEDED':
				tempState = { isLoading: false };
				return { ...state, ...tempState, ...action?.payload };

			// FACTOR MANAGEMENT
			case 'FACTORS_REMOVE_STARTED':
			case 'FACTORS_FETCH_STARTED':
				tempState = { isLoadingFactors: true };
				return { ...state, ...tempState, ...action?.payload };

			case 'FACTORS_FETCH_AVAILABLE_STARTED':
				tempState = { isLoadingFactorCatalog: true };
				return { ...state, ...tempState, ...action?.payload };

			case 'FACTORS_FETCH_AVAILABLE_SUCCESS':
				tempState = { isLoadingFactorCatalog: false };
				return { ...state, ...tempState, ...action?.payload };

			case 'FACTORS_REMOVE_SUCCEEDED':
			case 'FACTORS_FETCH_SUCCEEDED':
				tempState = { isStaleFactors: false, isLoadingFactors: false };
				return { ...state, ...tempState, ...action?.payload };

			// LOGIN
			case 'LOGIN_CODE_EXCHANGE_STARTED':
			case 'LOGIN_STARTED':
				tempState = { isLoadingLogin: true };
				return { ...state, ...tempState, ...action?.payload };

			case 'LOGIN_IFRAME_STARTED':
				tempState = { isVisibleAuthModal: true };
				return { ...state, ...tempState, ...action?.payload };

			case 'LOGIN_IFRAME_LOADED':
				tempState = { isLoadingLogin: false };
				return { ...state, ...tempState, ...action?.payload };

			case 'LOGIN_TOKEN_PARAMS_GENERATED':
				tempState = { isVisibleIframe: true };
				return { ...state, ...tempState, ...action?.payload };

			case 'LOGIN_REDIRECT_STARTED':
				tempState = { isLoadingLogin: true };
				return { ...state, ...tempState, ...action?.payload };

			case 'LOGIN_CANCELLED':
			case 'LOGIN_COMPLETED':
				delete state.tokenParams;
				tempState = { ...initialLoginState };
				return { ...state, ...tempState, ...action?.payload };

			case 'LOGIN_CODE_EXCHANGED':
				// 'default'
				return { ...state, ...action?.payload };

			// LOGOUT
			case 'LOGOUT_STARTED':
				tempState = { isLoadingLogout: true };
				return { ...state, ...tempState, ...action?.payload };
			case 'LOGOUT_SUCCEEDED':
				tempState = { ...initialState };
				return { ...state, ...tempState, ...action?.payload };

			// SILENT AUTH
			case 'SILENT_AUTH_STARTED':
				tempState = { isLoadingLogin: true };
				return { ...state, ...tempState, ...action?.payload };
			case 'SILENT_AUTH_SUCCEEDED':
				tempState = { ...initialLoginState };
				return { ...state, ...tempState, ...action?.payload };

			case 'SILENT_AUTH_ATTEMPTED':
				tempState = {
					...initialLoginState,
				};
				return { ...state, ...tempState, ...action?.payload };

			// STEP UP
			case 'STEP_UP_STARTED':
				tempState = {
					isLoadingLogin: true,
					isVisibleAuthModal: true,
				};
				return { ...state, ...tempState, ...action?.payload };

			case 'STEP_UP_COMPLETED':
				tempState = { isStepUpRequired: false };
				return { ...state, ...tempState, ...action?.payload };

			case 'STEP_UP_CHECKOUT_STARTED':
				tempState = { isLoadingStepUp: true };
				return { ...state, ...tempState, ...action?.payload };

			case 'STEP_UP_WEBAUTHN_STARTED':
			case 'STEP_UP_WEBAUTHN_COMPLETED':
			case 'STEP_UP_WEBAUTHN_FAILED':
			case 'STEP_UP_CANCELLED':
			case 'STEP_UP_FAILED':
			case 'STEP_UP_STATUS_UPDATED':
				return { ...state, ...action?.payload };

			// USER
			case 'USER_FETCH_STARTED':
				tempState = { isLoadingProfile: true };
				return { ...state, ...tempState, ...action?.payload };
			case 'USER_FETCH_SUCCEEDED':
				tempState = { isLoadingProfile: false };
				return { ...state, ...tempState, ...action?.payload };

			// WEBAUTHN
			case 'WEBAUTHN_USER_CANCELLED':
				tempState = { ...initialLoginState };
				return { ...state, ...tempState, ...action?.payload };

			case 'WEBAUTHN_ATTEST_STARTED':
			case 'WEBAUTHN_ATTEST_SUCCEEDED':
			case 'WEBAUTHN_ASSERT_STARTED':
			case 'WEBAUTHN_ASSERT_SUCCEEDED':
				// 'default'
				return { ...state, ...action?.payload };

			// ERRORS
			case 'ERROR_DISMISSED':
			case 'MFA_ISSUE_FAILED':
			case 'FACTOR_ENROLL_FAILED':
			case 'FACTOR_REMOVE_FAILED':
			case 'FACTORS_FETCH_FAILED':
			case 'FACTORS_FETCH_AVAILABLE_FAILED':
			case 'LOGIN_FAILED':
			case 'LOGIN_IFRAME_FAILED':
			case 'LOGIN_CODE_EXCHANGE_FAILED':
			case 'USER_FETCH_FAILED':
			case 'WEBAUTHN_FAILED':
				const errors = [...(state.errors ?? []), ...(action?.errors ?? [])];

				if (action?.error) {
					errors.push(action.error);
				}

				const result = {
					...state,
					...initialState,
					errors,
					...action?.payload,
				};

				console.debug('=== result ===');
				console.debug(result);

				return result;

			default:
				let error = new Error(`Unhandled action type: ${action.type}`);
				console.error(error);
				throw error;
		}
	} catch (error) {
		throw new Error(`authReducer error: [${error}]`);
	}
};
