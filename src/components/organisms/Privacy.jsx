/** @format */

import * as React from 'react';
import { Box, Container } from '@mui/material';
import { PrivacyContent, Typography, withRoot } from '../../components';

const PrivacyRoot = () => (
	<React.Fragment>
		<Container>
			<Box sx={{ mt: 7, mb: 12 }}>
				<Typography variant='h3' gutterBottom marked='center' align='center'>
					Privacy Policy
				</Typography>
				<PrivacyContent />
			</Box>
		</Container>
	</React.Fragment>
);

export const Privacy = withRoot(PrivacyRoot);
