/** @format */

import * as React from 'react';
import { Box, Container } from '@mui/material';
import { Typography, TermsContent, withRoot } from '../../components';

const TermsRoot = () => (
	<React.Fragment>
		<Container>
			<Box sx={{ mt: 7, mb: 12 }}>
				<Typography variant='h3' gutterBottom marked='center' align='center'>
					Terms
				</Typography>
				<TermsContent />
			</Box>
		</Container>
	</React.Fragment>
);

export const Terms = withRoot(TermsRoot);
