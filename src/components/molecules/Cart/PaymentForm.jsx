/** @format */

import { Fragment, useState, useEffect } from 'react';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import Cards from 'elt-react-credit-cards';
import 'elt-react-credit-cards/es/styles-compiled.css';

import { TextField, Typography } from '../../../components';

export const PaymentForm = () => {
	const [billing, setBilling] = useState({
		name: 'Harry Potter',
		number: '5103 6328 7917 4428',
		expiry: '01 / 30',
		cvc: '123',
	});
	const [savePayment, setSavePayment] = useState();
	const [focus, setFocus] = useState('name');

	useEffect(() => {
		let storage = JSON.parse(localStorage.getItem('billing')),
			address = JSON.parse(localStorage.getItem('address')),
			name = `${address?.firstName} ${address?.lastName}`;

		if (storage && address?.firstName) {
			storage = {
				...storage,
				name: name,
			};
		}

		if (storage) {
			setBilling(() => ({ ...billing, ...storage }));
		} else {
			localStorage.setItem('billing', JSON.stringify(billing));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleChange = (e) => {
		e.preventDefault();
		console.log(e.target);

		let id = e.target.id,
			value = e.target.value;

		if (id === 'savePayment') {
			value = e.target.checked;
			setSavePayment(() => value);
		}

		let newBilling = {
			...billing,
			[id]: value,
		};

		setBilling(() => newBilling);

		localStorage.setItem('billing', JSON.stringify(newBilling));
	};

	const handleFocusChange = (e) => {
		e.preventDefault();

		setFocus(() => e.target.name);
	};

	return (
		<Fragment>
			<Typography variant='h6' gutterBottom>
				Payment method
			</Typography>
			<Grid container spacing={4} sx={{ alignItems: 'center' }}>
				<Grid item xs={7}>
					<Cards
						cvc={billing?.cvc ?? ''}
						expiry={billing?.expiry ?? ''}
						name={billing?.name ?? ''}
						number={billing?.number ?? ''}
						focused={focus}
					/>
				</Grid>
				<Grid item xs={5}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<TextField
								onChange={handleChange}
								onFocus={handleFocusChange}
								required
								placeholder='0000 0000 0000 0000'
								id='number'
								name='number'
								label='Card Number'
								fullWidth
								value={billing?.number ?? ''}
								autoComplete='cc-number'
								size='small'
								autoFocus
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								id='name'
								name='name'
								label='Cardholder'
								fullWidth
								value={billing?.name ?? ''}
								autoComplete='cc-name'
								onChange={handleChange}
								onFocus={handleFocusChange}
								size='small'
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id='expiry'
								name='expiry'
								label='Expires'
								fullWidth
								value={billing?.expiry ?? ''}
								autoComplete='cc-exp'
								onChange={handleChange}
								onFocus={handleFocusChange}
								size='small'
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								required
								id='cvc'
								name='cvc'
								label='CVC'
								fullWidth
								value={billing?.cvc ?? ''}
								autoComplete='cc-csc'
								onChange={handleChange}
								onFocus={handleFocusChange}
								size='small'
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			{/* <CreditCardInput
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
			/> */}
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
