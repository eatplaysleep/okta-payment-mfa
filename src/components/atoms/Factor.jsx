/** @format */

import { IconButton, TableCell, TableRow } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Typography, WebAuthNButton } from './index';

export const Factor = ({ factor, onClick }) => {
	// const { onClick, factorId, status, name, device, type } = props;

	const removeFactor = () => onClick(factor?.factorId);

	return (
		<TableRow hover tabIndex={-1} key={factor?.factorId}>
			<TableCell key={`${factor?.name}-${factor?.factorId}`} align='left'>
				<Typography>{factor?.device?.type ?? factor?.name}</Typography>
			</TableCell>
			<TableCell key={`${factor?.status}-${factor?.factorId}`} align='left'>
				<Typography>{factor?.status}</Typography>
			</TableCell>
			<TableCell key={`auth-${factor?.factorId}`} align='center'>
				{factor?.type === 'webauthn' && (
					<WebAuthNButton
						factor={{ factorId: factor.factorId, factorType: factor.type }}
						user={factor?.userId}
					/>
				)}
			</TableCell>
			<TableCell key={`remove-${factor?.factorId}`} align='right'>
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
