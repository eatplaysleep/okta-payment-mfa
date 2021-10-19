/** @format */

import { useCart } from '../../hooks';
import { Box, IconButton, ListItem, ListItemText } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

import { Typography } from '../../components';

export const CartItem = ({ product }) => {
	const { removeProduct } = useCart();

	return (
		<ListItem sx={{ py: 1, px: 0 }} alignItems='flex-start'>
			<ListItemText
				primary={product.name}
				secondary={product.desc}
			></ListItemText>
			<Box
				sx={{
					flex: 1,
					display: 'flex',
					justifyContent: 'flex-end',
					alignItems: 'center',
				}}
			>
				<Typography variant='body2'>{product.price}</Typography>
				<IconButton
					edge='end'
					aria-label='remove'
					size='small'
					color='secondary'
					onClick={() => removeProduct(product)}
				>
					<RemoveCircleOutlineIcon />
				</IconButton>
			</Box>
		</ListItem>
	);
};
