/** @format */

import { Fragment, useState } from 'react';
import { InputLabel, NativeSelect } from '@mui/material';

export const FactorList = props => {
	const { onChange, factors } = props;
	// eslint-disable-next-line no-unused-vars
	const [selected, setSelected] = useState();

	return (
		<Fragment>
			<InputLabel variant='standard'>Available Factors</InputLabel>
			<NativeSelect
				inputProps={{ name: 'factor-list', id: 'factor-list' }}
				onChange={onChange}
				value={selected}
			>
				<option value='' key='undefined' />
				{factors.map(factor => {
					return (
						<option value={factor.type} key={factor.name}>
							{factor.name}
						</option>
					);
				})}
			</NativeSelect>
		</Fragment>
	);
};
