/** @format */
import { Fragment, useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { FactorTable, Loader, Paper, Typography } from '../../components';
import { useAuthState } from '../../providers';

export const Profile = () => {
	const { user, isLoadingProfile } = useAuthState();
	const [profile, setProfile] = useState();

	useEffect(() => {
		const buildProfile = () => {
			let profile = [];

			for (const [key, value] of Object.entries(user)) {
				if (key === 'address') {
					for (const [addressKey, addressValue] of Object.entries(value)) {
						profile.push({ key: addressKey, value: addressValue });
					}
				} else {
					profile.push({ key: key, value: value });
				}
			}

			if (profile.length > 0) {
				return profile.map(attribute => (
					<Fragment key={attribute.key}>
						<Grid item xs={6}>
							<Typography gutterBottom>{attribute.key}</Typography>
						</Grid>
						<Grid item xs={6}>
							<Typography gutterBottom>{attribute.value}</Typography>
						</Grid>
					</Fragment>
				));
			} else return <></>;
		};

		if (user) {
			console.log('building profile...');
			setProfile(() => buildProfile());
		}
	}, [user]);

	return (
		<Fragment>
			<Container component='section' sx={{ mt: 8, mb: 4 }}>
				<Typography variant='h4' marked='center' align='center' component='h2'>
					Profile
				</Typography>
				<Paper
					variant='outlined'
					sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
				>
					<Fragment>
						<Typography variant='h5' gutterBottom sx={{ mt: 2 }}>
							ATTRIBUTES
						</Typography>
						<Grid
							container
							spacing={2}
							sx={{
								justifyContent: 'flex-start',
								position: 'relative',
								minHeight: '200px',
							}}
						>
							{isLoadingProfile && <Loader />}
							{profile}
						</Grid>
					</Fragment>
				</Paper>
			</Container>
			<Container component='section' sx={{ mt: 8, mb: 4 }}>
				<Paper
					variant='outlined'
					sx={{ marginY: { xs: 3, md: 6 }, padding: { xs: 2, md: 3 } }}
				>
					<FactorTable />
				</Paper>
			</Container>
			{/* {user && (
				<FactorDialog
					open={dialogIsOpen}
					onClose={handleDialog}
					user={user?.sub}
				/>
			)} */}
		</Fragment>
	);
};
