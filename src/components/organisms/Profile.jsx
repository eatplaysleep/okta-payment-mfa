/** @format */
import { Fragment, useEffect, useState } from 'react';
import {
	Container,
	Grid,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Table,
} from '@mui/material';
import { Button, Factor, Paper, Typography } from '../atoms';
import { FactorDialog } from '../molecules';

export const Profile = () => {
	// eslint-disable-next-line no-unused-vars
	const [user, setUser] = useState(
		JSON.parse(localStorage.getItem('user') ?? {})
	);
	const [profile, setProfile] = useState();
	const [factors, setFactors] = useState();
	const [isStale, fetchFactors] = useState(true);
	const [dialogIsOpen, openDialog] = useState(false);
	const [handleFactor, removeFactor] = useState(false);
	const [factorId, setFactorId] = useState();

	const handleDialog = () => openDialog(() => !dialogIsOpen);

	const handleRemoveFactor = factorId => {
		setFactorId(() => factorId);
		removeFactor(() => true);
	};

	useEffect(() => {
		const buildProfile = () => {
			let profile = [];

			for (const [key, value] of Object.entries(user)) {
				profile.push({ key: key, value: value });
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

	useEffect(() => {
		const renderFactors = data => {
			const list = [];
			data.forEach(factor =>
				list.push(
					<Factor
						key={factor.factorId}
						child={factor}
						onClick={handleRemoveFactor}
					/>
				)
			);

			if (list) {
				return setFactors(() => list);
			}
		};

		if (isStale) {
			if (user) {
				let url = `${window.location.origin}/api/${user.sub}/factors`;

				return fetch(url)
					.then(resp => {
						if (resp.ok) {
							return resp.json();
						}
					})
					.then(resp => renderFactors(resp))
					.then(() => fetchFactors(() => false))
					.catch(err => console.error(err));
			}
		}
	}, [isStale, user]);

	useEffect(() => {
		const deleteFactor = factorId => {
			const url = `${window.location.origin}/api/${user?.sub}/factors/${factorId}`;
			const options = {
				method: 'DELETE',
			};

			fetch(url, options)
				.then(resp => {
					if (resp.ok) {
						console.log(JSON.stringify(resp, null, 2));
						return resp.json();
					}
				})
				.then(resp => setFactors(() => resp))
				.then(() => setFactorId(() => undefined))
				.catch(err => console.error(err));
		};

		if (factorId && handleFactor) {
			console.log('deleting factor...');
			removeFactor(() => false);

			deleteFactor(factorId);
			fetchFactors(() => true);
		}
	}, [handleFactor, factorId, user]);

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
						<Grid container spacing={2} sx={{ justifyContent: 'flex-start' }}>
							{profile}
						</Grid>
					</Fragment>
				</Paper>
			</Container>
			<Container component='section' sx={{ mt: 8, mb: 4 }}>
				<Paper
					variant='outlined'
					sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
				>
					<Fragment>
						<Typography variant='h5' gutterBottom sx={{ mt: 2 }}>
							FACTORS
						</Typography>
						<TableContainer>
							<Table stickyHeader>
								<TableHead>
									<TableRow>
										<TableCell key='type'>
											<Typography variant='h6'>Type</Typography>
										</TableCell>
										<TableCell key='status'>
											<Typography variant='h6'>Status</Typography>
										</TableCell>
										<TableCell key='remove' />
									</TableRow>
								</TableHead>
								<TableBody>{factors}</TableBody>
							</Table>
						</TableContainer>
						<div>
							<Button onClick={handleDialog}>Add Factor</Button>
						</div>
					</Fragment>
				</Paper>
			</Container>
			<FactorDialog
				open={dialogIsOpen}
				onClose={handleDialog}
				user={user?.sub}
			/>
		</Fragment>
	);
};
