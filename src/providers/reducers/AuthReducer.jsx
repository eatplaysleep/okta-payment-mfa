/** @format */

export const initialState = {
	isLoading: false,
	isAuthenticated: false,
};

export const AuthReducer = (state, action) => {
	console.info(JSON.stringify(action, null, 2));
	switch (action.type) {
		case 'GET_USER':
		case 'LOGIN_REDIRECT':
		case 'LOGIN_WITH_CREDENTIALS':
		case 'LOGIN':
			return { ...state, isLoading: true };
		// case 'INITIALIZE':
		// return { ...state, ...action?.payload, isLoading: true };
		case 'SUCCESS':
			return {
				...state,
				...action?.payload,
				isLoading: false,
			};
		case 'LOGOUT':
			return { ...state, isLoading: false };
		case 'LOGIN_ERROR':
			return { ...state, errorMessage: action?.error };
		default:
			throw new Error(`Unhandled action type: ${action.type}`);
	}
};
