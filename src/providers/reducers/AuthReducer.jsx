/** @format */

import * as _ from 'lodash';

export const initialState = {
	isError: false,
	isLoading: false,
	isLoadingLogin: false,
	isAuthenticated: false,
	isLoadingProfile: false,
	authModalIsVisible: false,
	errors: [],
};

export const AuthReducer = (state, action) => {
	// console.debug('======= current state =======');
	// console.debug(JSON.stringify(state, null, 2));
	console.debug('=======    dispatch     =======');
	console.debug(JSON.stringify(action, null, 2));
	try {
		switch (action.type) {
			// merge the basics: state, payload, errors
			case 'FACTOR_ENROLL_DIALOG':
			case 'DISMISS_ERROR':
				return _.merge({}, state, action?.payload, action?.errors);
			case 'GET_FACTORS':
			case 'REMOVE_FACTOR':
				return _.merge({}, state, action?.payload, { factorsAreLoading: true });
			case 'GET_USER':
				return _.merge({}, state, action?.payload, { isLoadingProfile: true });
			case 'LOGIN_AUTHORIZE':
			case 'LOGIN_STARTED':
				return _.merge({}, state, action?.payload, {
					iFrameIsVisible: true,
					authModalIsVisible: true,
					isLoadingLogin: false,
				});
			case 'LOGIN_START':
				return _.merge({}, state, action?.payload, { isLoadingLogin: true });
			case 'LOGIN_MODAL_START':
				return _.merge({}, state, action?.payload, {
					iFrameIsVisible: true,
					authModalIsVisible: true,
					isLoadingLogin: true,
				});
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
			case 'REMOVE_FACTOR_SUCCESS':
			case 'REMOVE_FACTOR_ERROR':
			case 'REFRESH_FACTORS':
				return _.merge({}, state, action?.payload, {
					factorsAreLoading: true,
					isStale: true,
				});
			case 'MFA_ENROLL_SUCCESS':
				return _.merge({}, state, action?.payload, {
					isLoading: false,
					isStale: true,
				});
			case 'STEP_UP_COMPLETE':
				return _.merge({}, state, { isStale: false }, action?.payload, {
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
			case 'LOGIN_SUCCESS':
				delete state.tokenParams;
				return _.merge({}, state, { isStale: true }, action?.payload, {
					isLoadingLogin: false,
				});
			case 'FETCH_FACTORS_SUCCESS':
				delete state.factors;

				return _.merge({}, state, action?.payload, {
					isStale: false,
					factorsAreLoading: false,
				});
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
			case 'LOGOUT':
				return _.merge({}, state, action?.payload, { isLoadingLogout: true });
			case 'MFA_ERROR':
			case 'WEBAUTHN_ERROR':
			case 'STEP_UP_ERROR':
			case 'FETCH_ERROR':
			case 'LOGIN_ERROR':
				let errors = _.merge([], state?.errors ?? [], [action?.error]);

				let result = _.merge({}, state, initialState, action?.payload, {
					errors,
				});
				console.debug('=== result ===');
				console.debug(result);
				if (action?.error) {
					console.error(action.error);
					delete action.error;
				}
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
