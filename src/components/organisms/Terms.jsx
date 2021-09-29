/** @format */

import * as React from 'react';
import { Box, Container } from '@mui/material';
import { Typography, TermsContent } from '../atoms';
import withRoot from '../withRoot.jsx';

function Terms() {
	return (
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
}

export default withRoot(Terms);
