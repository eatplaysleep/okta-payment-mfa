/** @format */

import { Fragment, useEffect, useState } from 'react';
import {
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Table,
} from '@mui/material';
import { Button, Factor, FactorDialog, Loader, Typography } from '../index';
import { useAuthDispatch, useAuthState } from '../../providers';

export const FactorTable = () => {
	const dispatch = useAuthDispatch();
	const { user, factors, fetchFactors, isStale, factorsAreLoading } =
		useAuthState();
	const [handleFactor, removeFactor] = useState(false);
	const [dialogIsOpen, openDialog] = useState(false);
	const [factorId, setFactorId] = useState();

	const handleDialog = () => openDialog(() => !dialogIsOpen);

	const handleRemoveFactor = factorId => {
		setFactorId(() => factorId);
		removeFactor(() => true);
	};

	useEffect(() => {
		if (user?.sub && (isStale || !factors)) {
			return fetchFactors(dispatch, user.sub);
		}
	}, [isStale]);

	useEffect(() => {
		const deleteFactor = async factorId => {
			const url = `${window.location.origin}/api/${user?.sub}/factors/${factorId}`;
			const options = {
				method: 'DELETE',
			};

			return fetch(url, options)
				.then(resp => {
					if (resp.ok) {
						return;
					} else throw resp;
				})
				.then(() => setFactorId(() => undefined))
				.catch(err => console.error(err));
		};

		if (factorId && handleFactor) {
			dispatch({ type: 'REMOVE_FACTOR' });
			console.log('deleting factor...');
			removeFactor(() => false);

			return deleteFactor(factorId).then(() =>
				dispatch({ type: 'REFRESH_FACTORS' })
			);
		}
	}, [handleFactor, factorId]);

	return (
		<Fragment>
			<Typography variant='h5' gutterBottom sx={{ mt: 2 }}>
				FACTORS
			</Typography>
			<TableContainer sx={{ minHeight: '100px' }}>
				<Table stickyHeader sx={{ position: 'relative' }}>
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
					<TableBody>
						{factorsAreLoading && <Loader />}

						{Array.isArray(factors) ? (
							factors.map(factor => (
								<Factor
									key={factor.factorId}
									factor={factor}
									onClick={handleRemoveFactor}
								/>
							))
						) : (
							<></>
						)}
					</TableBody>
				</Table>
			</TableContainer>
			<div>
				<Button onClick={handleDialog}>Add Factor</Button>
			</div>
			{user && (
				<FactorDialog
					open={dialogIsOpen}
					onClose={handleDialog}
					user={user?.sub}
				/>
			)}
		</Fragment>
	);
};
