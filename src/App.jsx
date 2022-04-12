/** @format */
import { Fragment, useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { SecureRoute } from '@okta/okta-react';
import { useSnackbar } from 'notistack';

import { Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { CartProvider, ProductsProvider, useAuthDispatch, useAuthState } from './providers';
import './styles/App.css';
import {
	AppFooter,
	AppLoginCallback,
	AppNavBar,
	Cart,
	Checkout,
	Home,
	Privacy,
	Profile,
	StepUpLoginCallback,
	Store,
	Terms,
} from './components';

const App = () => {
	const isStepUp = useRouteMatch('/stepup/callback');

	const dispatch = useAuthDispatch();

	const { enqueueSnackbar, closeSnackbar } = useSnackbar();

	const { errors } = useAuthState();

	useEffect(() => {
		const dismissSnackbar = (errorId) => {
			let newErrors = errors.filter((_, index) => index !== errorId);

			dispatch({ type: 'DISMISS_ERROR', errors: newErrors });
		};

		if (Array.isArray(errors) && errors.length > 0) {
			errors.forEach((error, index) =>
				enqueueSnackbar(error?.message ?? 'Unknown Error', {
					variant: 'error',
					action: (key) => (
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
				{!isStepUp && <AppNavBar />}
				<Switch>
					<SecureRoute path='/me' exact={true} component={Profile} />
					<Route path='/cart' exact component={Cart} />
					<Route path='/checkout' exact component={Checkout} />
					<Route path='/login/callback' exact component={AppLoginCallback} />
					<Route path='/stepup/callback' exact component={StepUpLoginCallback} />
					<Route path='/privacy' exact component={Privacy} />
					<Route path='/store' exact component={Store} />
					<Route path='/terms' exact component={Terms} />
					<Route path='*' component={Home} />
				</Switch>
				{!isStepUp && <AppFooter />}
			</CartProvider>
		</ProductsProvider>
	);
};

export default App;
