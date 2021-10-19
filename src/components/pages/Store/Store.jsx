/** @format */

import { Box, Container } from '@mui/material';
import { ProductsGrid, Typography } from '../../../components';

export const Store = () => {
	return (
		<Container component='section' sx={{ mt: 8, mb: 4 }}>
			<Typography variant='h4' marked='center' align='center' component='h2'>
				Store
			</Typography>
			<Box component='section' sx={{ display: 'flex', overflow: 'hidden' }}>
				<Container
					sx={{ mt: 15, mb: 30, display: 'flex', position: 'relative' }}
				>
					{/* <Box
						component='img'
						src='/static/themes/productCurvyLines.png'
						alt='curvy lines'
						sx={{ pointerEvents: 'none', position: 'absolute', top: -180 }}
					/> */}
					<ProductsGrid />
				</Container>
			</Box>
		</Container>
	);
};
