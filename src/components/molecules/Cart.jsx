/** @format */

import { Fragment } from 'react';
import { Box, Container, Grid } from '@mui/material';
import { useCart } from '../../hooks';
import { CartItems } from './index';
import { Button, Paper, Typography } from '../atoms';
import { formatNumber } from '../../helpers';

export const Cart = () => {
	const { total, cartItems, itemCount, handleCheckout } = useCart();

	return (
		<Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
			<Paper
				variant='outlined'
				sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
			>
				<Fragment>
					<Typography variant='h6' gutterBottom>
						Order summary
					</Typography>
					{cartItems?.length > 0 ? (
						<CartItems />
					) : (
						<Typography>Oh no! Your cart is empty! :(</Typography>
					)}
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
					<Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button
							variant='contained'
							onClick={handleCheckout}
							sx={{ mt: 3, ml: 1 }}
							disabled={itemCount < 1 ? true : false}
						>
							Checkout
						</Button>
					</Box>
				</Fragment>
			</Paper>
		</Container>
	);
};
