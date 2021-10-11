/** @format */

import { Button } from './index';
import { useAuthDispatch, useAuthActions } from '../../providers';

export const LoginButton = props => {
	const dispatch = useAuthDispatch();
	const { login } = useAuthActions();

	props = {
		onClick: () => login(dispatch),
		children: 'Login',
		color: 'inherit',
		...props,
	};
	return <Button {...props} />;
};
