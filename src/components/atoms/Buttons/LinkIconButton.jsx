/** @format */
import { Link } from 'react-router-dom';
import { IconButton } from '@mui/material';

export const LinkIconButton = ({ children, ...props }) => {
	const combinedProps = {
		size: 'large',
		color: 'inherit',
		component: Link,
		...props,
	};

	return <IconButton {...combinedProps}>{children}</IconButton>;
};
