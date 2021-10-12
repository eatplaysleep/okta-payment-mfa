/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { Button } from './Button';
import { useAuthDispatch, useAuthActions } from '../../providers';

export const LogoutButton = props => {
	const isIconButton = props?.isiconbutton === 'true' ? true : false;
	const dispatch = useAuthDispatch();
	const { logout } = useAuthActions();

	props = {
		onClick: () => logout(dispatch),
		children: 'Login',
		color: 'inherit',
		...props,
	};

	if (isIconButton) {
		props = {
			size: 'large',
			...props,
		};

		return (
			<div
				style={{
					display: 'flex',
					justifyContents: 'center',
					alignItems: 'center',
					width: '48px',
				}}
			>
				<IconButton {...props}>
					<Logout />
				</IconButton>
			</div>
		);
	} else return <Button {...props} />;
};
