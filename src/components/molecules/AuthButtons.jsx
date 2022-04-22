import { LoginButton, LogoutButton } from '../../components';
import { useAuthState } from '../../providers';

export const AuthButtons = () => {
	const { isLoadingLogin, isLoadingProfile, isAuthenticated } = useAuthState();

	if (!isAuthenticated) {
		return (
			<>
				{!isLoadingLogin && !isLoadingProfile && (
					<div>
						<LoginButton loginhint='signup' variant='text' children='Sign Up' />
					</div>
				)}
				<div>
					<LoginButton />
				</div>
			</>
		);
	}

	return (
		<>
			<div>
				<LogoutButton sx={{ color: 'secondary.main' }} />
			</div>
		</>
	);
};
