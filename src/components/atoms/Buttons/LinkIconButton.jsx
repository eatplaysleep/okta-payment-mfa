/** @format */
import { Link } from 'react-router-dom';
import { experimentalStyled as styled } from '@mui/material/styles';
import MuiIconButton from '@mui/material/IconButton';

const IconButtonRoot = styled(MuiIconButton)(({ theme }) => ({
	'&:hover': {
		backgroundColor: `${theme.palette.secondary.main}0a`,
	},
}));

export const LinkIconButton = ({ children, loading, ...props }) => {
	const combinedProps = {
		size: 'large',
		color: 'inherit',
		component: Link,
		loading: loading ? 'true' : 'false',
		...props,
	};

	return <IconButtonRoot {...combinedProps}>{children}</IconButtonRoot>;
};
