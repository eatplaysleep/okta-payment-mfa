/** @format */

import { IconButton, TableCell, TableRow } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Typography } from './index';

export const Factor = props => {
	const { onClick, child } = props;

	const removeFactor = () => onClick(child.id);

	return (
		<TableRow hover tabIndex={-1} key={child.id}>
			<TableCell key={child.name} align='left'>
				<Typography>{child.name}</Typography>
			</TableCell>
			<TableCell key={child.status} align='left'>
				<Typography>{child.status}</Typography>
			</TableCell>
			<TableCell key='remove' align='right'>
				<IconButton
					edge='end'
					size='small'
					color='secondary'
					onClick={removeFactor}
				>
					<RemoveCircleOutlineIcon />
				</IconButton>
			</TableCell>
		</TableRow>
	);
};
