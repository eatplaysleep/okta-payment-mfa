/** @format */

import { Fragment, useEffect, useState } from 'react';
import {
	Box,
	Container,
	Divider,
	Paper,
	Stepper,
	Step,
	StepLabel,
} from '@mui/material';
import swal from 'sweetalert';
import {
	AddressForm,
	Button,
	Loader,
	LoginButton,
	PaymentForm,
	ReviewOrder,
	Typography,
} from '../index';
import withRoot from '../withRoot';
import { useCart } from '../../hooks';
import { useAuthDispatch, useAuthState } from '../../providers';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function Checkout() {
	const dispatch = useAuthDispatch();
	const {
		authModalIsVisible,
		factors,
		fetchFactors,
		fidoMFA,
		isAuthenticated,
		isLoading,
		isStepUpRequired,
		isStale,
		issueMFA,
		user,
	} = useAuthState();
	// const [activeStep, setActiveStep] = useState(0);
	const {
		activeStep,
		clearCart,
		itemCount,
		handleCheckout,
		nextStep,
		previousStep,
		total,
		totalSteps,
	} = useCart();
	const [factorId, setFactorId] = useState();

	const doWebAuth = () => {
		dispatch({ type: 'STEP_UP_REQUIRED_FIDO' });
		handleCheckout();
	};

	useEffect(() => {
		if (user?.sub && (isStale || !factors)) {
			return fetchFactors(dispatch, user?.sub);
		}
	}, [isStale]);

	useEffect(() => {
		if (factors?.length > 0) {
			const webAuthNFactors =
				factors.filter(factor => factor.type === 'webauthn') || [];

			if (webAuthNFactors.length === 1) {
				setFactorId(() => webAuthNFactors[0].factorId);
			}
		}
	}, [factors]);

	useEffect(() => {
		if (activeStep === totalSteps && isStepUpRequired) {
			let options = {
				title: 'Payment Authorization',
				text: 'In order to continue with processing your order, we need to perform additional security verification.',
				buttons: ['Cancel', 'Continue'],
			};

			if (fidoMFA) {
				options = {
					...options,
					text: `${options.text}\n\nYou will now be prompted for biometric authorization.`,
				};
			}

			dispatch({ type: 'STEP_UP_START' });
			return swal(options).then(resp => {
				if (resp) {
					if (factorId && fidoMFA) {
						issueMFA(dispatch, user.sub, {
							factorId,
							factorType: 'webauthn',
						}).then(resp => {
							let options = {
								title: 'Success!',
								text: 'Thank you for completing our additional security verification.',
								button: 'Continue',
								icon: 'success',
							};

							if (!resp) {
								options = {
									...options,
									title: 'Uh oh!',
									text: 'Something went wrong. We are so sorry!',
									button: 'Drats',
									icon: 'error',
								};
							}

							return swal(options).then(() => clearCart());
						});
					} else {
						dispatch({ type: 'STEP_UP_MODAL_START' });
						handleCheckout();
					}
				} else {
					dispatch({ type: 'STEP_UP_CANCEL' });
					previousStep();
				}
			});
		}
	}, [activeStep]);

	useEffect(() => {
		if (activeStep < 3 && total >= 30) {
			dispatch({ type: 'STEP_UP_REQUIRED' });
		}
	}, [activeStep]);

	return (
		<Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
			<Paper
				variant='outlined'
				sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, position: 'relative' }}
			>
				{activeStep < 3 && (
					<Fragment>
						<Typography component='h1' variant='h4' align='center'>
							Checkout
						</Typography>
						<Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
							{steps.map(label => (
								<Step key={label}>
									<StepLabel>{label}</StepLabel>
								</Step>
							))}
						</Stepper>
					</Fragment>
				)}
				<Fragment>
					{activeStep === 0 && <AddressForm />}
					{activeStep === 1 && <PaymentForm />}
					{activeStep === 2 && <ReviewOrder />}
					{!authModalIsVisible &&
						activeStep === totalSteps &&
						isStepUpRequired &&
						isLoading && <Loader />}
					{activeStep === totalSteps && !isStepUpRequired && (
						<Fragment>
							<Typography variant='h5' gutterBottom>
								Thank you for your order.
							</Typography>
							<Typography variant='subtitle1'>
								Your order number is #2001539. We have emailed your order
								confirmation, and will send you an update when your order has
								shipped.
							</Typography>
						</Fragment>
					)}
					<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						{activeStep > 0 && activeStep < totalSteps && (
							<Button onClick={previousStep} sx={{ mt: 3, ml: 1 }}>
								Back
							</Button>
						)}

						{activeStep < 3 && (
							<Fragment>
								{activeStep === 2 && isStepUpRequired && factorId && (
									<Button
										variant='contained'
										onClick={doWebAuth}
										sx={{ mt: 3, ml: 1 }}
										disabled={itemCount < 1 ? true : false}
									>
										Place order (Factor API)
									</Button>
								)}
								{activeStep === 2 && (
									<Button
										variant='contained'
										onClick={handleCheckout}
										sx={{ mt: 3, ml: 1 }}
										disabled={itemCount < 1 ? true : false}
									>
										Place Order
									</Button>
								)}
								{activeStep < 2 && (
									<Button
										variant='contained'
										onClick={nextStep}
										sx={{ mt: 3, ml: 1 }}
										disabled={itemCount < 1 ? true : false}
									>
										Next
									</Button>
								)}
							</Fragment>
						)}
					</Box>
				</Fragment>
			</Paper>
		</Container>
	);
}

export default withRoot(Checkout);
