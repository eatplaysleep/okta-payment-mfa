/** @format */
import PropTypes from 'prop-types';
import { LoadingButton } from './LoadingButton';
import { useAuthActions, useAuthState, useAuthDispatch } from '../../../providers';

const LoginButtonRoot = (props) => {
	const dispatch = useAuthDispatch();
	const { isLoadingLogin, isLoadingProfile } = useAuthState();
	const { login } = useAuthActions();

	return (
		<LoadingButton
			{...{ onClick: () => login(dispatch), loading: isLoadingLogin || isLoadingProfile || false, ...props }}
		/>
	);
};

LoginButtonRoot.defaultProps = {
	color: 'secondary',
	children: 'Login',
	loading: false,
	size: 'small',
	variant: 'contained',
};

LoginButtonRoot.propTypes = {
	onClick: PropTypes.func,
	color: PropTypes.string,
	children: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
	loading: PropTypes.bool,
	size: PropTypes.string,
	variant: PropTypes.string,
};

export const LoginButton = LoginButtonRoot;
