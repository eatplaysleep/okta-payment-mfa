/** @format */

import { Button } from '../../../components';
import { useAuthDispatch, useAuthActions } from '../../../providers';

export const LoginButton = props => {
	const dispatch = useAuthDispatch();
	const { login } = useAuthActions();

	props = {
		onClick: () => login(dispatch, { ...props }),
		children: 'Login',
		color: 'inherit',
		...props,
	};
	return <Button {...props} />;
};
