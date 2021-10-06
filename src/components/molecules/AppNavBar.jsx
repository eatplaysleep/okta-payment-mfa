/** @format */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';

import {
	AppBar,
	LoginButton,
	LogoutButton,
	Toolbar,
	Typography,
} from '../atoms';
import { Box, IconButton, Link } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

export const AppNavBar = () => {
	const { authState, oktaAuth } = useOktaAuth();
	const [userInfo, setUserInfo] = useState();

	useEffect(() => {
		if (!authState?.isAuthenticated) {
			// When user isn't authenticated, forget any user info
			setUserInfo(null);
		} else {
			oktaAuth
				.getUser()
				.then(info => {
					if (info.headers) {
						delete info.headers;
					}

					localStorage.setItem('user', JSON.stringify(info));

					setUserInfo(() => info);
				})
				.catch(err => console.error(err));
		}
	}, [authState, oktaAuth]); // Update only if authState changes

	return (
		<AppBar>
			<Toolbar>
				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
					{authState?.isAuthenticated && (
						<div>
							<IconButton
								size='large'
								aria-label='profile'
								aria-controls='menu-appbar'
								color='inherit'
								href='/me'
							>
								<AccountCircle />
								<Typography variant='subtitle1'>
									&nbsp;&nbsp;{userInfo?.name}
								</Typography>
							</IconButton>
						</div>
					)}
				</Box>
				<Link href='/'>
					<Typography
						variant='h6'
						component='div'
						color='white'
						sx={{ fontSize: 24, textAlign: 'center' }}
					>
						Atko International
					</Typography>
				</Link>
				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
					{authState?.isAuthenticated && (
						<div>
							<LogoutButton
								isiconbutton='true'
								sx={{ color: 'secondary.main' }}
							/>
						</div>
					)}
					{!authState?.isAuthenticated && (
						// <Button color='inherit' children='Login' onClick={login} />
						<LoginButton />
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};
