/** @format */

import { useOktaAuth } from '@okta/okta-react';
import React, { Fragment, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
	AppBar,
	AuthModal,
	Button,
	LoginButton,
	LogoutButton,
	Toolbar,
	Typography,
} from '../atoms';
import { Box, Divider, IconButton } from '@mui/material';
import { AccountCircle, LockOutlined } from '@mui/icons-material';
import { CartIconButton, LinkIconButton } from '../index';
import { useAuthDispatch, useAuthState } from '../../providers';

export const AppNavBar = () => {
	const dispatch = useAuthDispatch();
	const { authModalIsVisible, isAuthenticated, user } = useAuthState();

	// useEffect(() => {
	// 	console.debug('isAuthenticated:', isAuthenticated);
	// }, [isAuthenticated]);

	return (
		<AppBar>
			<AuthModal
				loginhint={user?.login}
				open={authModalIsVisible}
				onClose={() => {}}
			/>
			<Toolbar>
				<Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
					{isAuthenticated && (
						<div>
							<Link to='/me' component={LinkIconButton}>
								<AccountCircle />
								<Typography variant='subtitle1'>
									&nbsp;&nbsp;{user?.name}
								</Typography>
							</Link>
						</div>
					)}
				</Box>
				<Link to='/' style={{ textDecoration: 'none' }}>
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
					<CartIconButton />
					{isAuthenticated && (
						<Fragment>
							<LogoutButton
								isiconbutton='true'
								sx={{ color: 'secondary.main' }}
							/>
						</Fragment>
					)}
					{!isAuthenticated && (
						<Fragment>
							<div>
								<LoginButton loginhint='signup' children='Sign Up' />
							</div>
							<div>
								<LoginButton />
							</div>
						</Fragment>
					)}
				</Box>
			</Toolbar>
		</AppBar>
	);
};
