/** @format */

import * as React from 'react';

import { Box, Button, Container, Grid } from '@mui/material';
import { Typography } from '../../components';

const item = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	px: 5,
};

const number = {
	fontSize: 24,
	fontFamily: 'default',
	color: 'secondary.main',
	fontWeight: 'medium',
};

const image = {
	height: 55,
	my: 4,
};

export const ProductHowItWorks = () => {
	return (
		<Box
			component='section'
			sx={{ display: 'flex', bgcolor: 'secondary.light', overflow: 'hidden' }}
		>
			<Container
				sx={{
					mt: 10,
					mb: 15,
					position: 'relative',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box
					component='img'
					src='/static/themes/productCurvyLines.png'
					alt='curvy lines'
					sx={{
						pointerEvents: 'none',
						position: 'absolute',
						top: -180,
						opacity: 0.7,
					}}
				/>
				<Typography variant='h4' marked='center' component='h2' sx={{ mb: 14 }}>
					How it works
				</Typography>
				<div>
					<Grid container spacing={5}>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={number}>1.</Box>
								<Box
									component='img'
									src='/static/themes/productHowItWorks1.svg'
									alt='suitcase'
									sx={image}
								/>
								<Typography variant='h5' align='center'>
									Appointment every Wednesday 9am.
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={number}>2.</Box>
								<Box
									component='img'
									src='/static/themes/productHowItWorks2.svg'
									alt='graph'
									sx={image}
								/>
								<Typography variant='h5' align='center'>
									First come, first served. Our offers are in limited
									quantities, so be quick.
								</Typography>
							</Box>
						</Grid>
						<Grid item xs={12} md={4}>
							<Box sx={item}>
								<Box sx={number}>3.</Box>
								<Box
									component='img'
									src='/static/themes/productHowItWorks3.svg'
									alt='clock'
									sx={image}
								/>
								<Typography variant='h5' align='center'>
									{'New offers every week. New experiences, new surprises. '}
									{'Your Sundays will no longer be alike.'}
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</div>
				<Button
					color='secondary'
					size='large'
					variant='contained'
					component='a'
					href='/premium-themes/onepirate/sign-up/'
					sx={{ mt: 8 }}
				>
					Get started
				</Button>
			</Container>
		</Box>
	);
};
