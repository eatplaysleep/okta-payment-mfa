/** @format */

import { CircularProgress, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { LoadingButton } from '../../../components';
import { useAuthState, useAuthDispatch } from '../../../providers';

export const LogoutButton = props => {
	const { loader } = props || {};
	const isIconButton = props?.isiconbutton === 'true' ? true : false;
	const dispatch = useAuthDispatch();
	const { logout, isLoadingLogout } = useAuthState();

	const onClick = () => {
		dispatch({ type: 'LOGOUT' });

		return logout(dispatch);
	};
	props = {
		onClick: onClick,
		children: 'Logout',
		color: 'inherit',
		loading: isLoadingLogout,
		...props,
	};

	if (isIconButton) {
		props = {
			size: 'large',
			...props,
		};

		// TODO fix padding/positioning
		const loaderProps = {
			color: 'secondary',
			size: 16,
			...loader,
		};

		const loaderComponent = <CircularProgress {...loaderProps} />;

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
					{props.loading && loaderComponent}
					{!props.loading && <Logout />}
				</IconButton>
			</div>
		);
	} else return <LoadingButton {...props} />;
};
