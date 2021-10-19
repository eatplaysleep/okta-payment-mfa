/** @format */

import { CartItem } from '../../components';
import { useCart } from '../../hooks';
import { List } from '@mui/material';

export const CartItems = () => {
	const { cartItems } = useCart();

	return (
		<List disablePadding>
			{cartItems.map(product => (
				<CartItem key={product.name} product={product} />
			))}
		</List>
	);
};
