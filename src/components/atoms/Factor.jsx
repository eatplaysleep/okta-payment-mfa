/** @format */

import { IconButton, TableCell, TableRow } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Typography, WebAuthButton, WebAuthNButton } from './index';

export const Factor = props => {
	const { onClick, child } = props;

	const removeFactor = () => onClick(child.factorId);

	return (
		<TableRow hover tabIndex={-1} key={child.factorId}>
			<TableCell key={`${child.name}-${child.factorId}`} align='left'>
				<Typography>{child?.device?.type ?? child.name}</Typography>
			</TableCell>
			<TableCell key={`${child.status}-${child.factorId}`} align='left'>
				<Typography>{child.status}</Typography>
			</TableCell>
			<TableCell key={`auth-${child.factorId}`} align='center'>
				{child?.type === 'webauthn' && (
					// <WebAuthNButton factor={child.factorId} user={child?.userId} />
					<WebAuthButton />
				)}
			</TableCell>
			<TableCell key={`remove-${child.factorId}`} align='right'>
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
