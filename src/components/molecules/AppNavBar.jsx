/** @format */

import { useOktaAuth } from '@okta/okta-react';
import React, { useState, useEffect } from 'react';

import {
	AppBar,
	AuthModal,
	Button,
	// LoadingOverlay,
	LoginButton,
	LogoutButton,
	Toolbar,
	Typography,
} from '../atoms';
import { Box, IconButton, Link } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useAuthState } from '../../providers';

export const AppNavBar = () => {
	const { isAuthenticated, user } = useAuthState();
	const [modalIsOpen, openModal] = useState();

	return (
		<AppBar>
			{/* <AuthModal
				loginhint='danny@atko.email'
				open={modalIsOpen}
				onClose={() => openModal(() => false)}
			/> */}
			<Toolbar>
				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
					{isAuthenticated && (
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
									&nbsp;&nbsp;{user?.name}
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
					<div>
						<Button
							onClick={() => openModal(() => true)}
							// onClick={fido}
							sx={{ color: 'inherit' }}
						>
							Step up
						</Button>
					</div>
					{isAuthenticated && (
						<div>
							<LogoutButton
								isiconbutton='true'
								sx={{ color: 'secondary.main' }}
							/>
						</div>
					)}
					{!isAuthenticated && <LoginButton />}
				</Box>
			</Toolbar>
		</AppBar>
	);
};
