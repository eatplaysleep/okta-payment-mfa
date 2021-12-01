/** @format */

import { LoadingButton } from './LoadingButton';
import { useAuthState, useAuthDispatch } from '../../../providers';

export const LoginButton = props => {
	const dispatch = useAuthDispatch();
	const { isLoadingLogin, isLoadingProfile } = useAuthState();

	props = {
		onClick: () => dispatch({ type: 'LOGIN_MODAL_START' }),
		color: 'secondary',
		children: 'Login',
		loading: isLoadingLogin ?? isLoadingProfile ?? false,
		size: 'small',
		variant: 'contained',
		...props,
	};

	return <LoadingButton {...props} />;
};
