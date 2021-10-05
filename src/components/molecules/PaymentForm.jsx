/** @format */

import { Fragment, useState, useEffect } from 'react';
import { MaskedTextField, TextField, Typography } from '../atoms';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import CreditCardInput from 'react-credit-card-input';

export const PaymentForm = ({ callback }) => {
	const [billing, setBilling] = useState({
		cardNumber: '5103 6328 7917 4428',
		cardExpiry: '01 / 30',
		cvc: '123',
	});
	const [savePayment, setSavePayment] = useState();

	useEffect(() => {
		let storage = JSON.parse(localStorage.getItem('billing')),
			address = JSON.parse(localStorage.getItem('address')),
			cardHolder = `${address?.firstName} ${address?.lastName}`;

		if (storage && address?.firstName) {
			storage = {
				...storage,
				cardHolder: cardHolder,
			};
		}

		if (storage) {
			setBilling(() => ({ ...billing, ...storage }));
		} else {
			localStorage.setItem('billing', JSON.stringify(billing));
		}
	}, []);

	const handleChange = e => {
		e.preventDefault();
		console.log(e.target);

		let id = e.target.id,
			value = e.target.value;

		if (id === 'savePayment') {
			value = e.target.checked;
		}

		let newBilling = {
				[id]: value,
			},
			result = {
				...billing,
				...newBilling,
			};

		setBilling(() => result);

		localStorage.setItem('billing', JSON.stringify(result));
	};

	return (
		<Fragment>
			<Typography variant='h6' gutterBottom>
				Payment method
			</Typography>
			<CreditCardInput
				cardNumberInputProps={{
					id: 'cardNumber',
					value: billing?.cardNumber ?? '',
					onChange: handleChange,
				}}
				cardExpiryInputProps={{
					id: 'cardExpiry',
					value: billing?.cardExpiry ?? '',
					onChange: handleChange,
				}}
				cardCVCInputProps={{
					value: billing?.cvc ?? '',
					onChange: handleChange,
				}}
			/>
			<Grid item xs={12}>
				<FormControlLabel
					control={
						<Checkbox
							id='savePayment'
							color='secondary'
							name='savePayment'
							checked={billing?.savePayment ?? savePayment}
							onChange={handleChange}
						/>
					}
					label='Save this payment for future use.'
				/>
			</Grid>
		</Fragment>
	);
};
