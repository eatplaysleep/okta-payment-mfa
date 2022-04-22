/** @format */

import { Fragment, useEffect, useState } from 'react';
import { Box, Container, Paper, Stepper, Step, StepLabel } from '@mui/material';
import swal from 'sweetalert';
import { AddressForm, Button, Loader, PaymentForm, ReviewOrder, Typography, withRoot } from '../../components';
import { useCart } from '../../hooks';
import { useAuthActions, useAuthDispatch, useAuthState } from '../../providers';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

const CheckoutRoot = () => {
	const dispatch = useAuthDispatch();
	const { factors, hasWebAuthn, isLoadingStepUp, isStepUpRequired, isStaleFactors, user } = useAuthState();
	const { fetchFactors, webAuthnStepUp } = useAuthActions();

	const { activeStep, checkout, clearCart, itemCount, handleCheckout, nextStep, previousStep } = useCart();
	const [factorId, setFactorId] = useState();

	useEffect(() => {
		if (user?.sub && (isStaleFactors || !factors)) {
			return fetchFactors(dispatch, user?.sub);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isStaleFactors]);

	useEffect(() => {
		if (factors?.length > 0) {
			const webAuthNFactors = factors.filter((factor) => factor.type === 'webauthn') || [];

			if (webAuthNFactors.length === 1) {
				setFactorId(() => webAuthNFactors[0].factorId);
			}
		}
	}, [factors]);

	useEffect(() => {
		if (checkout && isStepUpRequired) {
			let options = {
				title: 'Payment Authorization',
				text: 'In order to continue with processing your order, we need to perform additional security verification.',
				buttons: ['Cancel', 'Continue'],
			};

			if (hasWebAuthn) {
				options = {
					...options,
					text: `${options.text}\n\nYou will now be prompted for biometric authorization.`,
				};
			}

			return swal(options).then((willContinue) => {
				if (willContinue && hasWebAuthn) {
					webAuthnStepUp(dispatch, { userId: user.sub, discover: true }).then((success) => {
						if (!success) {
							dispatch({ type: 'STEP_UP_FAILED' });

							return swal({
								...options,
								title: 'Uh oh!',
								text: 'Something went wrong. We are so sorry! Please try again.',
								button: 'Drats',
								icon: 'error',
							});
						}

						dispatch({ type: 'STEP_UP_COMPLETED' });

						return swal({
							title: 'Success!',
							text: 'Thank you for completing our additional security verification.',
							button: 'Continue',
							icon: 'success',
						}).then(() => clearCart());
					});
				} else {
					dispatch({ type: 'STEP_UP_CANCELLED' });
					previousStep();
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [checkout, isStepUpRequired]);

	return (
		<Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
			<Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 }, position: 'relative' }}>
				{activeStep < 3 && (
					<Fragment>
						<Typography component='h1' variant='h4' align='center'>
							Checkout
						</Typography>
						<Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
							{steps.map((label) => (
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
					{checkout && isStepUpRequired && isLoadingStepUp && <Loader />}
					{checkout && !isStepUpRequired && (
						<Fragment>
							<Typography variant='h5' gutterBottom>
								Thank you for your order.
							</Typography>
							<Typography variant='subtitle1'>
								Your order number is #2001539. We have emailed your order confirmation, and will send you an update when
								your order has shipped.
							</Typography>
						</Fragment>
					)}
					<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						{activeStep > 0 && (
							<Button onClick={previousStep} sx={{ mt: 3, ml: 1 }}>
								Back
							</Button>
						)}

						{activeStep < 3 && (
							<Fragment>
								{activeStep === 2 && (
									<Button
										variant='contained'
										onClick={() => handleCheckout({ authDispatch: dispatch, isStepUpRequired })}
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
};

export const Checkout = withRoot(CheckoutRoot);
