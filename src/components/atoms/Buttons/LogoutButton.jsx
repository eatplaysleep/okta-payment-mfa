/** @format */

import { CircularProgress, IconButton } from '@mui/material';
import { Logout } from '@mui/icons-material';
import PropTypes from 'prop-types';

import { LoadingButton } from '../../../components';
import { useAuthActions, useAuthState, useAuthDispatch } from '../../../providers';

const LogoutButtonRoot = (props) => {
	const { loader } = props || {};

	const isIconButton = true;

	const dispatch = useAuthDispatch();
	const { isLoadingLogout, isLoadingLogin } = useAuthState();
	const { logout } = useAuthActions();

	const onClick = () => logout(dispatch);

	const isLoading = isLoadingLogout || isLoadingLogin || false;

	props = {
		onClick: onClick,
		loading: isLoading.toString(),
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
					{isLoading && loaderComponent}
					{!isLoading && <Logout />}
				</IconButton>
			</div>
		);
	} else return <LoadingButton {...props} />;
};

LogoutButtonRoot.defaultProps = {
	children: 'Logout',
	color: 'inherit',
	loading: 'false',
};

LogoutButtonRoot.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	color: PropTypes.string,
	loading: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
	loader: PropTypes.node,
};

export const LogoutButton = LogoutButtonRoot;
