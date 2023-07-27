import { Button, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import type { ListItemProps } from '@mui/material';

import { BiometricsIcon, MfaIcon, PhoneIcon, SmsIcon } from '../../atoms/Icons';
import React from 'react';

export const FactorItem = (props: FactorItemProps) => {
	const { onClick, icon, label = 'Unknown Factor', type, sx, ...rest } = props || {};

	return (
		<ListItem sx={{ py: 2, minWidth: '300px', ...sx }} {...rest}>
			<ListItemIcon>{icon ?? getIcon(type)}</ListItemIcon>
			<ListItemText sx={{ textTransform: 'uppercase' }}>{label}</ListItemText>
			<Button
				size='small'
				variant='outlined'
				data-factorType={type}
				onClick={onClick as React.MouseEventHandler<HTMLButtonElement> | undefined}
			>
				Enroll
			</Button>
		</ListItem>
	);
};

export interface FactorItemProps extends ListItemProps {
	icon?: React.ReactNode;
	label?: string;
	type?: FactorKey;
}

function getIcon(factorType?: FactorKey) {
	console.log(factorType);
	switch (factorType) {
		case 'call':
			return <PhoneIcon />;
		case 'sms':
			return <SmsIcon />;
		case 'webauthn':
			return <BiometricsIcon />;
		default:
			return <MfaIcon />;
	}
}
