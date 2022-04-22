/** @format */

import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppBar, AuthButtons, AuthModal, CartIconButton, LinkIconButton, Toolbar, Typography } from '../../components';
import { Box } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuthActions, useAuthDispatch, useAuthState } from '../../providers';

export const AppNavBar = () => {
	const dispatch = useAuthDispatch();

	const { isVisibleAuthModal, isAuthenticated, user } = useAuthState();
	const { silentAuth } = useAuthActions();

	useEffect(() => {
		if (!isAuthenticated) {
			return silentAuth(dispatch);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<AppBar>
			<AuthModal loginhint={user?.login} open={isVisibleAuthModal} onClose={() => {}} />
			<Toolbar>
				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
					{isAuthenticated && (
						<div>
							<LinkIconButton to='/me'>
								<AccountCircle />
								<Typography variant='subtitle1'>&nbsp;&nbsp;{user?.name}</Typography>
							</LinkIconButton>
						</div>
					)}
				</Box>
				<Link to='/' style={{ textDecoration: 'none' }}>
					<Typography variant='h6' component='div' color='white' sx={{ fontSize: 24, textAlign: 'center' }}>
						Atko International
					</Typography>
				</Link>
				<Box
					sx={{
						flex: 1,
						display: 'flex',
						justifyContent: 'flex-end',
						alignItems: 'center',
					}}
				>
					<CartIconButton />
					<AuthButtons />
				</Box>
			</Toolbar>
		</AppBar>
	);
};
