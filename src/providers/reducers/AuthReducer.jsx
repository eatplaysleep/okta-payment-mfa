/** @format */

import * as _ from 'lodash';

export const initialState = {
	isError: false,
	isLoading: false,
	isLoadingLogin: false,
	isAuthenticated: false,
	isLoadingProfile: false,
	authModalIsVisible: false,
};

export const AuthReducer = (state, action) => {
	// console.debug('======= current state =======');
	// console.debug(JSON.stringify(state, null, 2));
	// console.debug('=======    action     =======');
	// console.debug(JSON.stringify(action, null, 2));
	switch (action.type) {
		case 'DISMISS_ERROR':
			if (state?.error) {
				delete state.error;
			}
			return _.merge({}, state, action?.payload, { isError: false });
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
		case 'STEP_UP_SUCCESS':
			state = _.merge({}, state, action?.payload, {
				isLoading: false,
				isStepUpRequired: true,
				fidoMFA: false,
			});
		// eslint-disable-next-line no-fallthrough
		case 'GET_USER_SUCCESS':
		case 'SILENT_AUTH_SUCCESS':
		case 'SILENT_AUTH_CANCEL':
		case 'AUTHN_SUCCESS':
		case 'IDX_NEXT':
		case 'LOGIN_SUCCESS':
			delete state.tokenParams;
			return _.merge({}, state, { isStale: true }, action?.payload, {
				isLoadingLogin: false,
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
		case 'STEP_UP_ERROR':
		case 'FETCH_ERROR':
		case 'LOGIN_ERROR':
			let result = _.merge({}, state, initialState, action?.payload, {
				error: action?.error,
				isError: true,
			});
			if (action?.error) {
				console.error(action.error);
			}
			return result;
		default:
			let error = new Error(`Unhandled action type: ${action.type}`);
			console.error(error);
			throw error;
	}
};
