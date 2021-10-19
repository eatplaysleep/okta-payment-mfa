/** @format */
import * as React from 'react';
import { Link } from '@mui/material';

export const Copyright = () => {
	return (
		<React.Fragment>
			{'© '}
			<Link color='inherit' href='https://atko.email/'>
				Atko International
			</Link>{' '}
			{new Date().getFullYear()}
		</React.Fragment>
	);
};
