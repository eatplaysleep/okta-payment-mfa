/** @format */

export const initialState = {
	isLoading: false,
	isAuthenticated: false,
};

export const AuthReducer = (state, action) => {
	console.debug('======= current state =======');
	console.debug(JSON.stringify(state, null, 2));
	console.debug('=======    action     =======');
	console.debug(JSON.stringify(action, null, 2));
	switch (action.type) {
		case 'GET_FACTORS':
		case 'REMOVE_FACTOR':
			return { ...state, factorsAreLoading: true };
		case 'GET_USER':
			return { ...state, profileIsLoading: true };
		case 'STEP_UP_STARTED':
			return {
				...state,
				...action?.payload,
				iFrameIsVisible: true,
				authModalIsVisible: true,
				isLoading: false,
			};
		case 'STEP_UP_START':
			return {
				...state,
				...action?.payload,
				isLoading: true,
			};
		case 'STEP_UP_MODAL_START':
			return {
				...state,
				...action?.payload,
				iFrameIsVisible: true,
				authModalIsVisible: true,
				isLoading: true,
			};
		case 'LOGIN_REDIRECT':
		case 'LOGIN_WITH_CREDENTIALS':
		case 'LOGIN':
			return { ...state, ...action?.payload, isLoading: true };
		// case 'INITIALIZE':
		// return { ...state, ...action?.payload, isLoading: true };
		case 'REFRESH_FACTORS':
			let resp = {
				...state,
				...action?.payload,
				factorsAreLoading: true,
				isStale: true,
			};
			console.debug(JSON.stringify(resp, null, 2));
			return resp;
		case 'MFA_ENROLL_SUCCESS':
			return {
				...state,
				...action?.payload,
				isLoading: false,
				isStale: true,
			};
		case 'STEP_UP_COMPLETE':
			return {
				...state,
				isStale: false,
				...action?.payload,
				isLoading: true,
				iFrameIsVisible: false,
				authModalIsVisible: false,
			};
		case 'STEP_UP_REQUIRED_FIDO':
			state = { ...state, fidoMFA: true };
		// eslint-disable-next-line no-fallthrough
		case 'STEP_UP_REQUIRED':
			return {
				...state,
				...action?.payload,
				isLoading: false,
				isStepUpRequired: true,
			};
		case 'STEP_UP_SUCCESS':
			state = {
				...state,
				isStepUpRequired: false,
				fidoMFA: false,
				isLoading: false,
			};
		// eslint-disable-next-line no-fallthrough
		case 'GET_USER_SUCCESS':
		case 'AUTHN_SUCCESS':
		case 'SUCCESS':
			return {
				...state,
				isStale: true,
				...action?.payload,
				isLoading: false,
			};
		case 'STEP_UP_CANCEL':
			return {
				...state,
				...action?.payload,
				isLoading: false,
				authModalIsVisible: false,
			};
		case 'LOGOUT_SUCCESS':
			return { ...state, ...action?.payload, isLoading: false };
		case 'LOGOUT':
			return { ...state, ...action?.payload, isLoading: true };
		case 'MFA_ERROR':
		case 'STEP_UP_ERROR':
		case 'FETCH_ERROR':
		case 'LOGIN_ERROR':
			return { ...state, errorMessage: action?.error };
		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};
