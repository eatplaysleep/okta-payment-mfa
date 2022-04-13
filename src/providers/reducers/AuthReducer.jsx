/* eslint-disable no-fallthrough */
/** @format */

import * as _ from 'lodash';

const initialLoginState = {
	isLoadingLogin: false,
	isVisibleAuthModal: false,
	isVisibleIframe: false,
	isAuthenticated: false,
};

export const initialState = {
	// isLoading == general 'is busy' indicator that locks the entire app with a loading overlay
	isLoading: false,

	isLoadingFactors: false,
	isLoadingFactorCatalog: false,
	isLoadingLogout: false,
	isLoadingProfile: false,
	// isStaleFactors == if 'true', fetch new factors
	isStaleFactors: false,
	isStaleUser: false,

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
				tempState = { isLoadingLogin: false, isLoadingFactors: false, isStaleFactors: false };
				return { ...state, ...tempState, ...action?.payload };

			// FACTOR ENROLLMENT
			case 'FACTOR_ENROLL_DIALOG_TOGGLED':
			case 'FACTOR_ENROLL_STARTED':
				tempState = { isLoading: true };
				return { ...state, ...tempState, ...action?.payload };

			// 'default'
			case 'FACTOR_ENROLL_SUCCEEDED':
				return { ...state, ...action?.payload };

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

			// WEBAUTHN
			case 'WEBAUTHN_ATTEST_STARTED':
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

			// ===

			case 'DISMISS_ERROR':
				return _.merge({}, state, action?.payload, { isLoadingFactors: true });
			case 'GET_USER':
				return _.merge({}, state, action?.payload, { isLoadingProfile: true });
			case 'LOGIN_AUTHORIZE':
			// case 'LOGIN_STARTED':
			// 	return _.merge({}, state, action?.payload, {
			// 		iFrameIsVisible: true,
			// 		authModalIsVisible: true,
			// 		isLoadingLogin: false,
			// 	});
			// case 'LOGIN_START':
			// 	return _.merge({}, state, action?.payload, { isLoadingLogin: true });
			// case 'LOGIN_MODAL_START':
			// 	return _.merge({}, state, action?.payload, {
			// 		iFrameIsVisible: true,
			// 		authModalIsVisible: true,
			// 		isLoadingLogin: true,
			// 	});
			case 'SILENT_AUTH_START':
				return _.merge({}, state, action?.payload, {
					isLoadingLogin: true,
				});
			case 'SILENT_AUTH_END':
				return _.merge({}, state, action?.payload, {
					isLoadingLogin: false,
					authModalIsVisible: false,
					iFrameIsVisible: false,
				});
			case 'STEP_UP_STARTED':
				return _.merge({}, state, action?.payload, {
					isLoadingLogin: false,
					authModalIsVisible: false,
					iFrameIsVisible: false,
				});
			case 'STEP_UP_START':
				return _.merge({}, state, action?.payload, {
					isLoadingLogin: true,
				});
			case 'STEP_UP_MODAL_START':
				return _.merge({}, state, action?.payload, {
					isLoadingLogin: true,
					authModalIsVisible: true,
					iFrameIsVisible: true,
				});
			case 'LOGIN_REDIRECT':
				return _.merge({}, state, action?.payload, {
					isLoadingLogin: true,
				});
			case 'EXCHANGE_CODE':
			case 'LOGIN_COMPLETE':
				return _.merge({}, state, action?.payload, {
					isLoadingLogin: true,
					iFrameIsVisible: false,
					authModalIsVisible: false,
				});

			case 'LOGIN_WITH_CREDENTIALS':
			case 'LOGIN':
				return _.merge({}, state, action?.payload, { isLoadingLogin: true });
			case 'REFRESH_FACTORS':
				return _.merge({}, state, action?.payload, {
					factorsAreLoading: true,
					isStaleFactors: true,
				});
			case 'MFA_ENROLL_SUCCESS':
				return _.merge({}, state, action?.payload, {
					isLoading: false,
					isStaleFactors: true,
				});
			case 'STEP_UP_COMPLETE':
				return _.merge({}, state, { isStaleFactors: false }, action?.payload, {
					isLoading: false,
					iFrameIsVisible: false,
					authModalIsVisible: false,
				});
			case 'STEP_UP_REQUIRED_FIDO':
				state = { ...state, fidoMFA: true };
			// eslint-disable-next-line no-fallthrough
			case 'STEP_UP_REQUIRED':
				return _.merge({}, state, action?.payload, {
					isLoading: false,
					isStepUpRequired: true,
				});
			case 'MFA_SUCCESS':
				state = _.merge({}, state, action?.payload, {
					isLoading: false,
					isStepUpRequired: true,
					fidoMFA: false,
				});
			// eslint-disable-next-line no-fallthrough
			case 'GET_USER_SUCCESS':
			case 'SILENT_AUTH_SUCCESS':
				state.authModalIsVisible = false;
				state.iFrameIsVisible = false;
			// eslint-disable-next-line no-fallthrough
			case 'SILENT_AUTH_CANCEL':
			case 'AUTHN_SUCCESS':
			case 'IDX_NEXT':
			// case 'LOGIN_SUCCESS':
			// 	delete state.tokenParams;
			// 	return _.merge({}, state, { isStale: true }, action?.payload, {
			// 		isLoadingLogin: false,
			// 	});

			case 'FACTOR_ENROLL_SUCCESS':
			case 'SUCCESS':
				return _.merge({}, state, action?.payload, {
					isLoading: false,
				});
			case 'STEP_UP_CANCEL':
			case 'LOGIN_CANCEL':
				return _.merge({}, state, action?.payload, {
					isLoadingLogin: false,
					authModalIsVisible: false,
					iFrameIsVisible: false,
					idxModalIsVisible: false,
				});
			case 'LOGOUT_SUCCESS':
				return _.merge({}, state, action?.payload, { isLoadingLogout: false });

			// bad stuff
			case 'WEBAUTHN_ERROR':
			case 'STEP_UP_ERROR':

			case 'FETCH_ERROR':
			case 'LOGIN_ERROR':
			// let errors = _.merge([], state?.errors ?? [], [action?.error]);

			// let result = _.merge({}, state, initialState, action?.payload, {
			// 	errors,
			// });
			// console.debug('=== result ===');
			// console.debug(result);
			// if (action?.error) {
			// 	console.error(action.error);
			// 	delete action.error;
			// }
			// return result;
			default:
				let error = new Error(`Unhandled action type: ${action.type}`);
				console.error(error);
				throw error;
		}
	} catch (error) {
		throw new Error(`authReducer error: [${error}]`);
	}
};
