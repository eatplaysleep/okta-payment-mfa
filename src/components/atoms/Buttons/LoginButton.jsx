/** @format */

import { LoadingButton } from './LoadingButton';
import { useAuthActions, useAuthState, useAuthDispatch } from '../../../providers';

export const LoginButton = (props) => {
	const dispatch = useAuthDispatch();
	const { isLoadingLogin, isLoadingProfile } = useAuthState();
	const { login } = useAuthActions();

	props = {
		onClick: () => login(dispatch),
		color: 'secondary',
		children: 'Login',
		loading: isLoadingLogin ?? isLoadingProfile ?? false,
		size: 'small',
		variant: 'contained',
		...props,
	};

	return <LoadingButton {...props} />;
};
