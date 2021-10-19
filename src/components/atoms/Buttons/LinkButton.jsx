/** @format */
import { forwardRef } from 'react';
import { Button } from '../../../components';

export const LinkButton = forwardRef((props, ref) => {
	const { children } = props;

	const combinedProps = {
		color: 'secondary',
		variant: 'contained',
		size: 'large',
		sx: { minWidth: 200 },
		...props,
	};
	return (
		<Button ref={ref} {...combinedProps}>
			{children}
		</Button>
	);
});
