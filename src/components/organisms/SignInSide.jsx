/** @format */

import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
// import { useOktaAuth } from '@okta/okta-react';
import {
	Avatar,
	Box,
	CssBaseline,
	CircularProgress,
	Grid,
	Link,
	Paper,
	TextField,
	Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useAuthDispatch, useAuthState, useAuthActions } from '../../providers';
import { LoadingOverlay } from '../index';

const theme = createTheme();

export const SignInSide = () => {
	const dispatch = useAuthDispatch();
	const { isLoading } = useAuthState();
	const { loginWithCredentials } = useAuthActions();
	const [submitLogin, setSubmitLogin] = useState(false);
	const [userLogin, setLogin] = useState();

	useEffect(() => {
		if (submitLogin && userLogin?.username && userLogin?.password) {
			setSubmitLogin(() => false);

			return loginWithCredentials(dispatch, userLogin);
		}
	}, [submitLogin, userLogin, isLoading, dispatch, loginWithCredentials]);

	const handleSubmit = e => {
		e.preventDefault();
		const data = new FormData(e.currentTarget);

		if (!userLogin) {
			setLogin(null);
		}

		setLogin(() => ({
			username: data.get('username'),
			password: data.get('password'),
		}));
		setSubmitLogin(() => true);
	};

	const handleFormChange = e => {
		const id = e?.target?.id;
		const value = e?.target?.value;

		setLogin({ ...userLogin, submit: { [id]: value } });
	};

	const handleSubmitSignIn = e => {
		e.preventDefault();

		if (!userLogin) {
			setLogin(null);
		}

		setLogin(() => ({ ...userLogin }));
		setSubmitLogin(() => true);
	};

	return (
		<ThemeProvider theme={theme}>
			{/* {isLoading && <LoadingOverlay open={isLoading} />} */}
			<Grid container component='main' sx={{ height: '100vh' }}>
				<CssBaseline />
				<Grid
					item
					xs={false}
					sm={4}
					md={7}
					sx={{
						backgroundImage: 'url(https://source.unsplash.com/random)',
						backgroundRepeat: 'no-repeat',
						backgroundColor: t =>
							t.palette.mode === 'light'
								? t.palette.grey[50]
								: t.palette.grey[900],
						backgroundSize: 'cover',
						backgroundPosition: 'center',
					}}
				/>
				<Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
					<Box
						sx={{
							my: 8,
							mx: 4,
							display: 'flex',
							flexDirection: 'column',
							alignItems: 'center',
						}}
					>
						<Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
							<LockOutlinedIcon />
						</Avatar>
						<Typography component='h1' variant='h5'>
							Sign in
						</Typography>
						<Box
							component='form'
							noValidate
							onSubmit={handleSubmit}
							sx={{ mt: 1 }}
						>
							<TextField
								margin='normal'
								required
								fullWidth
								id='username'
								label='Email'
								name='username'
								autoFocus
								disabled={isLoading}
								value={userLogin?.username}
								onChange={handleFormChange}
							/>
							<TextField
								margin='normal'
								required
								fullWidth
								name='password'
								label='Password'
								type='password'
								id='password'
								autoComplete='current-password'
								disabled={isLoading}
								value={userLogin?.password}
								onChange={handleFormChange}
							/>
							{/* <FormControlLabel
								control={<Checkbox value='remember' color='primary' />}
								label='Remember me'
							/> */}
							<LoadingButton
								type='submit'
								children='Sign In'
								fullWidth
								variant='contained'
								sx={{ mt: 3, mb: 2 }}
								loading={isLoading}
								loadingIndicator={
									<CircularProgress color='inherit' size={16} />
								}
							/>
							{/* <Grid container>
								<Grid item xs>
									<Link href='#' variant='body2'>
										Forgot password?
									</Link>
								</Grid>
								<Grid item>
									<Link href='#' variant='body2'>
										{"Don't have an account? Sign Up"}
									</Link>
								</Grid>
							</Grid> */}
						</Box>
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
};
