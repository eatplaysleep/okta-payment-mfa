/** @format */

import { Fragment, useEffect, useState } from 'react';
import { Checkbox, FormControlLabel, Grid } from '@mui/material';
import { TextField, Typography } from '../../../components';
import { useAuthState } from '../../../providers';

export const AddressForm = () => {
	const { user, isAuthenticated } = useAuthState();
	const [address, setAddress] = useState();

	useEffect(() => {
		if (user && isAuthenticated) {
			setAddress(() => ({
				...address,
				firstName: user?.given_name,
				lastName: user?.family_name,
				address1: user?.address?.street_address,
				city: user?.address?.locality,
				state: user?.address?.region,
				zip: user?.address?.postal_code,
				country: user?.address?.country_code ?? 'US',
			}));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, isAuthenticated]);

	const handleChange = e => {
		e.preventDefault();

		let id = e.target.id,
			value = e.target.value;

		if (id === 'saveAddress') {
			value = e.target.checked;
		}

		let newAddress = {
			[id]: value,
		};

		setAddress(() => ({ ...address, ...newAddress }));

		localStorage.setItem('address', JSON.stringify(address));
	};

	return (
		<Fragment>
			<Typography variant='h6' gutterBottom>
				Shipping address
			</Typography>
			<Grid container spacing={3}>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id='firstName'
						name='firstName'
						label='First name'
						fullWidth
						value={address?.firstName ?? ''}
						autoComplete='given-name'
						variant='standard'
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id='lastName'
						name='lastName'
						label='Last name'
						fullWidth
						value={address?.lastName ?? ''}
						autoComplete='family-name'
						variant='standard'
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						required
						id='address1'
						name='address1'
						label='Address line 1'
						fullWidth
						value={address?.address1 ?? ''}
						autoComplete='shipping address-line1'
						variant='standard'
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<TextField
						id='address2'
						name='address2'
						label='Address line 2'
						fullWidth
						value={address?.address2 ?? ''}
						autoComplete='shipping address-line2'
						variant='standard'
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id='city'
						name='city'
						label='City'
						fullWidth
						value={address?.city ?? ''}
						autoComplete='shipping address-level2'
						variant='standard'
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						id='state'
						name='state'
						label='State/Province/Region'
						fullWidth
						value={address?.state ?? ''}
						variant='standard'
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id='zip'
						name='zip'
						label='Zip / Postal code'
						fullWidth
						value={address?.zip ?? ''}
						autoComplete='shipping postal-code'
						variant='standard'
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12} sm={6}>
					<TextField
						required
						id='country'
						name='country'
						label='Country'
						fullWidth
						value={address?.country ?? ''}
						autoComplete='shipping country'
						variant='standard'
						onChange={handleChange}
					/>
				</Grid>
				<Grid item xs={12}>
					<FormControlLabel
						control={
							<Checkbox
								id='saveAddress'
								color='secondary'
								name='saveAddress'
								checked={address?.saveAddress}
								onChange={handleChange}
							/>
						}
						label='Use this address for payment details'
					/>
				</Grid>
			</Grid>
		</Fragment>
	);
};
