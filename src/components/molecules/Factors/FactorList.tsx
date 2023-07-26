/** @format */

import { Box, List } from '@mui/material';

import { FactorItem } from './FactorItem';

import type { ListProps } from '@mui/material';
import React from 'react';

export const FactorList = (props: FactorListProps) => {
	const { onClick, factors = [] } = props;

	return (
		<Box sx={{ width: '100%' }}>
			<List>
				{factors.map(({ id, factorType: type, name: label }) => {
					return (
						<>
							<FactorItem
								key={id}
								onClick={onClick as React.MouseEventHandler<HTMLLIElement> | undefined}
								{...{ type, label }}
							/>
						</>
					);
				})}
			</List>
		</Box>
	);
};

export interface FactorListProps extends Omit<ListProps, 'onClick'> {
	factors: Factor[];
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}
