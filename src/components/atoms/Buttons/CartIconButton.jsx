/** @format */
import { Badge } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { LinkIconButton } from '../../../components';
import { useCart } from '../../../hooks';

export const CartIconButton = ({ children, ...props }) => {
	const { itemCount } = useCart();

	return (
		<div
			style={{
				display: 'flex',
				justifyContents: 'center',
				alignItems: 'center',
				width: '48px',
			}}
		>
			<LinkIconButton to='/cart' {...props}>
				<Badge badgeContent={itemCount} color='secondary'>
					<ShoppingBag />
					{children}
				</Badge>
			</LinkIconButton>{' '}
		</div>
	);
};
