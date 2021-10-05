/** @format */

import { Fragment, useState } from 'react';
import { Box, Container, Paper, Stepper, Step, StepLabel } from '@mui/material';
import { Button, Typography } from '../atoms';
import { AddressForm, PaymentForm, ReviewOrder } from '../molecules';
import withRoot from '../withRoot';

const steps = ['Shipping address', 'Payment details', 'Review your order'];

function Checkout() {
	const [activeStep, setActiveStep] = useState(0);

	const getStepContent = step => {
		switch (step) {
			case 0:
				return <AddressForm />;
			case 1:
				return <PaymentForm />;
			case 2:
				return <ReviewOrder />;
			default:
				throw new Error('Unknown step');
		}
	};
	const handleNext = () => {
		setActiveStep(activeStep + 1);
	};

	const handleBack = () => {
		setActiveStep(activeStep - 1);
	};

	return (
		<Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
			<Paper
				variant='outlined'
				sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
			>
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
				<Fragment>
					{activeStep === steps.length ? (
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
					) : (
						<Fragment>
							{getStepContent(activeStep)}
							<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
								{activeStep !== 0 && (
									<Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
										Back
									</Button>
								)}

								<Button
									variant='contained'
									onClick={handleNext}
									sx={{ mt: 3, ml: 1 }}
								>
									{activeStep === steps.length - 1 ? 'Place order' : 'Next'}
								</Button>
							</Box>
						</Fragment>
					)}
				</Fragment>
			</Paper>
		</Container>
	);
}

export default withRoot(Checkout);
