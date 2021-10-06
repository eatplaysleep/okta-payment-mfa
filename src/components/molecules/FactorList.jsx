/** @format */

import { Fragment, useEffect, useState } from 'react';
import { InputLabel, NativeSelect } from '@mui/material';

export const FactorList = props => {
	const { onChange, factors } = props;

	const [selected, setSelected] = useState();

	return (
		<Fragment>
			<InputLabel variant='standard'>Available Factors</InputLabel>
			<NativeSelect
				inputProps={{ name: 'factor-list', id: 'factor-list' }}
				onChange={onChange}
				value={selected}
			>
				{factors.map(factor => {
					return <option value={factor.type}>{factor.name}</option>;
				})}
			</NativeSelect>
		</Fragment>
	);
};
