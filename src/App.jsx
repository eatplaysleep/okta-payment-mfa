/** @format */
import { Fragment, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { useSnackbar } from 'notistack';

import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { routes } from './config';
import {
	CartProvider,
	ProductsProvider,
	useAuthDispatch,
	useAuthState,
} from './providers';
import './styles/App.css';
import { AppFooter, AppNavBar, SignIn } from './components';

const App = () => {
	const isStepUp = useRouteMatch('/stepup/callback');

	const dispatch = useAuthDispatch();

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const { errors } = useAuthState();

	useEffect(() => {
		const dismissSnackbar = errorId => {
			let newErrors = errors.filter((_, index) => index !== errorId);

			dispatch({ type: 'DISMISS_ERROR', errors: newErrors });
		};

		if (Array.isArray(errors) && errors.length > 0) {
			errors.forEach((error, index) =>
				enqueueSnackbar(error?.message ?? 'Unknown Error', {
					variant: 'error',
					action: key => (
						<Fragment>
							<Button size='small' onClick={() => alert(error?.stack)}>
								Details
							</Button>
							<IconButton size='small' onClick={() => closeSnackbar(key)}>
								<CloseIcon />
							</IconButton>
						</Fragment>
					),
					onExit: () => dismissSnackbar(index),
				})
			);
		}
	}, [errors, dispatch, enqueueSnackbar, closeSnackbar]);

	return (
		<ProductsProvider>
			<CartProvider>
				<Route path='/login' component={SignIn} exact />
				{!isStepUp && <AppNavBar />}
				<div>
					<Switch>
						{routes.map(route => {
							if (route?.isSecure) {
								return (
									<SecureRoute
										key={route.path}
										path={route.path}
										exact={route?.isExact ?? false}
										component={route.component}
									/>
								);
							} else {
								return (
									<Route
										key={route.path}
										path={route.path}
										exact={route?.isExact ?? false}
										component={route.component}
									/>
								);
							}
						})}
					</Switch>
				</div>
				{!isStepUp && <AppFooter />}
			</CartProvider>
		</ProductsProvider>
	);
};

export default App;
