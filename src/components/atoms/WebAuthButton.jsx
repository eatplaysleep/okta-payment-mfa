/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { Button } from './Button';

export const WebAuthButton = props => {
	// eslint-disable-next-line no-unused-vars
	const { authState, oktaAuth } = useOktaAuth();

	const login = async () => {
		const request = {
			method: 'post',
		};
	};

	const onClick = () => login();

	props = {
		onClick: onClick,
		children: 'Login',
		color: 'inherit',
		...props,
	};
	return <Button {...props} />;
};
