/** @format */
import { Link } from 'react-router-dom';
import { Button } from '../../../components';

export const LinkButton = ({ to, children, ...props }) => {
	const combinedProps = {
		color: 'secondary',
		variant: 'contained',
		size: 'large',
		sx: { minWidth: 200 },
		...props,
	};
	return (
		<Button to={to} {...combinedProps} component={Link}>
			{children}
		</Button>
	);
};
