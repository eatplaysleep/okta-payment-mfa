/** @format */

import { Fragment, useEffect, useState } from 'react';
import { Typography } from '../atoms';
import { Divider, Grid } from '@mui/material';
import { useCart } from '../../hooks';
import { CartItems } from './index';
import { formatNumber } from '../../helpers';

export const ReviewOrder = () => {
	const { total, cartItems, itemCount, handleCheckout } = useCart();
	const [address, setAddress] = useState();
	const [billing, setBilling] = useState();

	useEffect(() => {
		let address = JSON.parse(localStorage.getItem('address')),
			billing = JSON.parse(localStorage.getItem('billing'));

		if (address) {
			setAddress(() => address);
		}

		if (billing) {
			setBilling(() => billing);
		}
	}, []);

	return (
		<Fragment>
			<Typography variant='h6' gutterBottom>
				Order summary
			</Typography>
			{cartItems?.length > 0 ? (
				<CartItems />
			) : (
				<Typography>Oh no! Your cart is empty! :(</Typography>
			)}
			<Divider />
			<Grid container spacing={2} sx={{ justifyContent: 'flex-end' }}>
				<Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
					SUMMARY
				</Typography>
				<Grid container>
					<Fragment>
						<Grid item xs={6}>
							<Typography gutterBottom align='right'>
								Total Items
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography gutterBottom align='right'>
								{itemCount}
							</Typography>
						</Grid>
					</Fragment>
					<Fragment>
						<Grid item xs={6}>
							<Typography gutterBottom align='right'>
								Total Amount
							</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography gutterBottom align='right'>
								{formatNumber(total)}
							</Typography>
						</Grid>
					</Fragment>
				</Grid>
			</Grid>
			<Divider />
			<Grid container spacing={2}>
				<Grid item xs={12} sm={6}>
					<Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
						Shipping
					</Typography>
					{address?.firstName && (
						<Typography gutterBottom>
							{address.firstName} {address.lastName}
						</Typography>
					)}
					{address?.address1 && (
						<Typography gutterBottom>{address.address1}</Typography>
					)}
					{address?.address2 && (
						<Typography gutterBottom>{address.address2}</Typography>
					)}
					{address?.city && (
						<Typography gutterBottom>
							{address.city}, {address.state} {address.zip}
						</Typography>
					)}
					{address?.country && (
						<Typography gutterBottom>{address.country}</Typography>
					)}
				</Grid>
				<Grid item container direction='column' xs={12} sm={6}>
					<Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
						Payment details
					</Typography>
					<Grid container>
						{billing?.cardHolder && (
							<Fragment key='cardHolder'>
								<Grid item xs={6}>
									<Typography gutterBottom>Card Holder</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography gutterBottom>{billing.cardHolder}</Typography>
								</Grid>
							</Fragment>
						)}
						{billing?.cardNumber && (
							<Fragment key='cardNumber'>
								<Grid item xs={6}>
									<Typography gutterBottom>Card Number</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography gutterBottom>
										XXXX-XXXX-XXXX-
										{billing.cardNumber.slice(billing.cardNumber.length - 4)}
									</Typography>
								</Grid>
							</Fragment>
						)}
						{billing?.cardExpiry && (
							<Fragment key='cardExpiry'>
								<Grid item xs={6}>
									<Typography gutterBottom>Expiry Date</Typography>
								</Grid>
								<Grid item xs={6}>
									<Typography gutterBottom>{billing.cardExpiry}</Typography>
								</Grid>
							</Fragment>
						)}
					</Grid>
				</Grid>
			</Grid>
		</Fragment>
	);
};
