/** @format */

export const getUserInfo = async (oktaAuth, dispatch) => {
	try {
		const isAuthenticated = await oktaAuth.isAuthenticated();
		let payload = { isAuthenticated };

		if (dispatch) {
			dispatch({
				type: 'USER_FETCH_STARTED',
				payload,
			});
		}

		if (isAuthenticated) {
			console.debug('Fetching user info...');
			const user = await oktaAuth.getUser();

			if (user?.headers) {
				delete user.headers;
			}

			payload = { ...payload, user };

			localStorage.setItem('user', JSON.stringify(user));

			if (dispatch) {
				dispatch({ type: 'USER_FETCH_SUCCEEDED', payload });
			}
		}
		return payload;
	} catch (error) {
		if (dispatch) {
			console.error(error);
			dispatch({ type: 'USER_FETCH_FAILED', error: error });
		} else throw error;
	}
};
