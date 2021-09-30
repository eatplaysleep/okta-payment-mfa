/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { Button } from './Button';

export const LoginButton = props => {
	const signup = props?.signup ?? false;
	// eslint-disable-next-line no-unused-vars
	const { authState, oktaAuth } = useOktaAuth();
	const enroll = async () =>
		oktaAuth.signInWithRedirect({ loginHint: 'signup' });
	const login = async () => authState.signInWithRedirect();

	const onClick = () => {
		if (signup) {
			enroll();
		} else login();
	};
	props = {
		onClick: onClick,
		children: 'Login',
		color: 'inherit',
		...props,
	};
	return <Button {...props} />;
};
