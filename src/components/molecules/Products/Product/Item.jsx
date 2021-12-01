/** @format */

import { Box, Grid, IconButton } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Typography } from '../../../../components';
import { useCart } from '../../../../hooks';
import { formatNumber } from '../../../../utils';

const item = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	px: 5,
	minHeight: 336,
};

export const ProductItem = ({ product }) => {
	const { addProduct, cartItems, removeProduct } = useCart();

	const isInCart = product => {
		return !!cartItems.find(item => item.id === product.id);
	};

	// console.log(product);

	return (
		<Grid item xs={12} md={4}>
			<Box sx={item}>
				<Box
					component='img'
					src={product.photo}
					alt={product.name}
					id={product.id}
					sx={{ maxHeight: 200 }}
				/>
				<Typography variant='h6' sx={{ my: 5 }}>
					{product.name}
				</Typography>
				<Typography variant='h5'>{product?.description}</Typography>
			</Box>
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<Typography variant='body1'>{formatNumber(product.price)}</Typography>
				{isInCart(product) && (
					<IconButton
						edge='end'
						aria-label='remove'
						size='small'
						color='primary'
						onClick={() => removeProduct(product)}
					>
						<RemoveCircleOutlineIcon />
					</IconButton>
				)}
				{!isInCart(product) && (
					<IconButton
						edge='end'
						aria-label='add'
						size='small'
						color='primary'
						onClick={() => addProduct(product)}
					>
						<AddCircleIcon />
					</IconButton>
				)}
			</Box>
		</Grid>
	);
};
