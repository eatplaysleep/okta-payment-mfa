/** @format */

import { Box, CssBaseline, Grid, Paper } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { OktaSignInWidget } from '../../components';

const theme = createTheme();

export const SignIn = ({ okta }) => {
	return (
		<ThemeProvider theme={theme}>
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
						<OktaSignInWidget />
					</Box>
				</Grid>
			</Grid>
		</ThemeProvider>
	);
};
