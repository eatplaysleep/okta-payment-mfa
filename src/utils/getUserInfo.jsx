/** @format */

export const getUserInfo = async (oktaAuth, dispatch) => {
	try {
		const isAuthenticated = await oktaAuth.isAuthenticated();

		if (dispatch) {
			dispatch({
				type: 'GET_USER',
				payload: { isAuthenticated: isAuthenticated },
			});
		}

		let payload = { isAuthenticated, isLoadingProfile: false };

		if (isAuthenticated) {
			console.debug('Fetching user info...');
			const user = await oktaAuth.getUser();

			if (user?.headers) {
				delete user.headers;
			}

			payload = { ...payload, user };

			localStorage.setItem('user', JSON.stringify(user));

			if (dispatch) {
				dispatch({ type: 'GET_USER_SUCCESS', payload: payload });
			}
		}
		return payload;
	} catch (error) {
		if (dispatch) {
			console.error(error);
			dispatch({ type: 'LOGIN_ERROR', error: error });
		} else throw error;
	}
};
