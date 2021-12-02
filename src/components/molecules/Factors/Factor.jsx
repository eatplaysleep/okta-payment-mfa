/** @format */

import { IconButton, TableCell, TableRow } from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { Typography, WebAuthNButton } from '../../../components';

export const Factor = ({ factor, onClick }) => {
	// const { onClick, factorId, status, name, device, type } = props;

	const removeFactor = () => onClick(factor?.id);

	return (
		<TableRow hover tabIndex={-1} key={factor?.idd}>
			<TableCell key={`${factor?.name}-${factor?.id}`} align='left'>
				<Typography>
					{factor?.profile?.authenticatorName ?? factor?.name}
				</Typography>
			</TableCell>
			<TableCell key={`${factor?.status}-${factor?.id}`} align='left'>
				<Typography>{factor?.status}</Typography>
			</TableCell>
			<TableCell key={`auth-${factor?.id}`} align='center'>
				{factor?.factorType === 'webauthn' && (
					<WebAuthNButton size='small' variant='outlined' factor={factor} />
				)}
			</TableCell>
			<TableCell key={`remove-${factor?.id}`} align='right'>
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
