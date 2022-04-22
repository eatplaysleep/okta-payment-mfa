/** @format */

import { Box, CircularProgress, TableCell } from '@mui/material';
import PropTypes from 'prop-types';

const LoaderRoot = ({ color, size, component }) => {
	let progress = (
		<CircularProgress
			color={color}
			size={size}
			sx={{
				// position: 'absolute',
				left: '50%',
				top: '50%',
				transform: 'translate(-50%, -50%)',
			}}
		/>
	);

	if (component === 'tr') {
		progress = <TableCell>{progress}</TableCell>;
	}

	return (
		<Box
			component={component}
			sx={{
				backgroundColor: 'rgba(255, 255, 255, 0.80)',
				display: 'flex',
				height: '100%',
				width: '100%',
				justifyContent: 'center',
				alignContent: 'center',
				alignItems: 'center',
				float: 'left',
				zIndex: 10,
				position: 'absolute',
				right: 0,
				top: 0,
			}}
		>
			{progress}
		</Box>
	);
};

LoaderRoot.defaultProps = {
	color: 'secondary',
	size: 65,
};

LoaderRoot.propTypes = {
	color: PropTypes.string,
	size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	component: PropTypes.string,
};

export const Loader = LoaderRoot;
