/** @format */

import * as React from 'react';
import { Box, Container } from '@mui/material';
import { PrivacyContent, Typography } from '../atoms';
import withRoot from '../withRoot.jsx';

function Privacy() {
	return (
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
}

export default withRoot(Privacy);
