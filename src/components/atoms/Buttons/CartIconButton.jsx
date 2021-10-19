/** @format */
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { Badge, IconButton } from '@mui/material';
import { ShoppingBag } from '@mui/icons-material';
import { useCart } from '../../../hooks';

const LinkIconButton = forwardRef((props, ref) => {
	const { children } = props;
	const { itemCount } = useCart();

	const combinedProps = {
		size: 'large',
		ariaLabel: 'cart',
		ariaControls: 'menu-appbar',
		color: 'inherit',
		...props,
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContents: 'center',
				alignItems: 'center',
				width: '48px',
			}}
		>
			<IconButton ref={ref} {...combinedProps}>
				<Badge badgeContent={itemCount} color='secondary'>
					<ShoppingBag />
					{children}
				</Badge>
			</IconButton>
		</div>
	);
});

export const CartIconButton = props => {
	const combinedProps = {
		component: LinkIconButton,
		...props,
	};

	return <Link to='/cart' {...combinedProps} />;
};
