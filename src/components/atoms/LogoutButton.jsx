/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { Button } from './Button';

export const LogoutButton = props => {
	const isIconButton = props?.isIconButton ?? false;
	// eslint-disable-next-line no-unused-vars
	const { authState, oktaAuth } = useOktaAuth();
	const clearUserData = async () => {
		localStorage.removeItem('userInfo');
		localStorage.removeItem('userProfile');
	};

	const logout = async () => {
		try {
			await clearUserData();
			await authState.signOut();
		} catch (err) {
			throw err;
		}
	};

	props = {
		onClick: logout,
		children: 'Login',
		color: 'inherit',
		...props,
	};

	if (isIconButton) {
		props = {
			size: 'large',
			ariaLabel: 'logout',
			ariaControls: 'menu-appbar',
			...props,
		};

		return (
			<IconButton {...props}>
				<Logout />
			</IconButton>
		);
	} else return <Button {...props} />;
};
