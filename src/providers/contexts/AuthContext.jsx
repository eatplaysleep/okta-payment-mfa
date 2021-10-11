/** @format */

import { createContext, useEffect, useReducer } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import { getUserInfo } from '../../utils';
import { AuthDispatchContext, AuthReducer, initialState } from '../index';

export const AuthStateContext = createContext();

export const AuthProvider = ({ children }) => {
	const { oktaAuth } = useOktaAuth();
	// const [state, setState] = useState({ isLoading: false });
	const [state, dispatch] = useReducer(AuthReducer, initialState);

	useEffect(() => {
		if (!state?.user) {
			return getUserInfo(oktaAuth).then(resp => {
				if (resp?.isAuthenticated) {
					return dispatch({ type: 'SUCCESS', payload: { ...resp } });
				}
			});
		}
	}, [oktaAuth, dispatch, getUserInfo, initialState, state]);

	return (
		<AuthStateContext.Provider value={state}>
			<AuthDispatchContext.Provider value={dispatch}>
				{children}
			</AuthDispatchContext.Provider>
		</AuthStateContext.Provider>
	);
};
