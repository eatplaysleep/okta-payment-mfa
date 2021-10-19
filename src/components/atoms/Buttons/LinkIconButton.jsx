/** @format */
import { forwardRef } from 'react';
import { IconButton } from '@mui/material';

export const LinkIconButton = forwardRef((props, ref) => {
	const { children } = props;

	const combinedProps = {
		size: 'large',
		ariaLabel: 'profile',
		ariaControls: 'menu-appbar',
		color: 'inherit',
		...props,
	};

	return (
		<IconButton ref={ref} {...combinedProps}>
			{children}
		</IconButton>
	);
});
