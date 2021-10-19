/** @format */

import * as React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Theme } from '../theme';

export const withRoot = Component => {
	// export default function withRoot(Component) {
	const WithRoot = props => (
		<ThemeProvider theme={Theme}>
			{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
			<CssBaseline />
			<Component {...props} />
		</ThemeProvider>
	);

	return WithRoot;
};
