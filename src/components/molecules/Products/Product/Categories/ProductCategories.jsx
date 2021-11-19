/** @format */

import * as React from 'react';
import { Box, Container } from '@mui/material';
import { ImageIconButton, Typography } from '../../../..';
import { ImageBackdrop } from './ImageBackdrop';

const images = [
	{
		url: 'https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=400&q=80',
		title: 'Snorkeling',
		width: '40%',
	},
	{
		url: 'https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?auto=format&fit=crop&w=400&q=80',
		title: 'Massage',
		width: '20%',
	},
	{
		url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400&q=80',
		title: 'Hiking',
		width: '40%',
	},
	{
		url: 'https://images.unsplash.com/photo-1453747063559-36695c8771bd?auto=format&fit=crop&w=400&q=80',
		title: 'Tour',
		width: '38%',
	},
	{
		url: 'https://images.unsplash.com/photo-1523309996740-d5315f9cc28b?auto=format&fit=crop&w=400&q=80',
		title: 'Gastronomy',
		width: '38%',
	},
	{
		url: 'https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=400&q=80',
		title: 'Shopping',
		width: '24%',
	},
	{
		url: 'https://images.unsplash.com/photo-1506941433945-99a2aa4bd50a?auto=format&fit=crop&w=400&q=80',
		title: 'Walking',
		width: '40%',
	},
	{
		url: 'https://images.unsplash.com/photo-1533727937480-da3a97967e95?auto=format&fit=crop&w=400&q=80',
		title: 'Fitness',
		width: '20%',
	},
	{
		url: 'https://images.unsplash.com/photo-1518136247453-74e7b5265980?auto=format&fit=crop&w=400&q=80',
		title: 'Reading',
		width: '40%',
	},
];

export const ProductCategories = () => {
	return (
		<Container component='section' sx={{ mt: 8, mb: 4 }}>
			<Typography variant='h4' marked='center' align='center' component='h2'>
				For all tastes and all desires
			</Typography>
			<Box sx={{ mt: 8, display: 'flex', flexWrap: 'wrap' }}>
				{images.map(image => (
					<ImageIconButton
						key={image.title}
						style={{
							width: image.width,
						}}
					>
						<Box
							sx={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								backgroundSize: 'cover',
								backgroundPosition: 'center 40%',
								backgroundImage: `url(${image.url})`,
							}}
						/>
						<ImageBackdrop className='imageBackdrop' />
						<Box
							sx={{
								position: 'absolute',
								left: 0,
								right: 0,
								top: 0,
								bottom: 0,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								color: 'common.white',
							}}
						>
							<Typography
								component='h3'
								variant='h6'
								color='inherit'
								className='imageTitle'
							>
								{image.title}
								<div className='imageMarked' />
							</Typography>
						</Box>
					</ImageIconButton>
				))}
			</Box>
		</Container>
	);
};
