/** @format */

import { Fragment, useEffect, useState } from 'react';
import {
	Box,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Table,
} from '@mui/material';
import {
	Button,
	Factor,
	FactorDialog,
	IdxModal,
	Loader,
	Typography,
	WebAuthNButton,
} from '../../../components';
import { useAuthDispatch, useAuthState } from '../../../providers';

export const FactorTable = () => {
	const dispatch = useAuthDispatch();
	const {
		user,
		factors,
		fetchFactors,
		// idxModalIsVisible,
		isStale,
		factorsAreLoading,
		hasWebAuthn,
	} = useAuthState();
	const [handleFactor, removeFactor] = useState(false);
	const [dialogIsOpen, openDialog] = useState(false);
	const [idxModalIsOpen, openIdxModal] = useState(false);
	const [factorId, setFactorId] = useState();

	const handleDialog = () => openDialog(() => !dialogIsOpen);

	const handleIdxModal = () => openIdxModal(() => !idxModalIsOpen);

	const handleRemoveFactor = factorId => {
		setFactorId(() => factorId);
		removeFactor(() => true);
	};

	useEffect(() => {
		if (user?.sub && (isStale || !factors)) {
			return fetchFactors(dispatch, user.sub);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
						{(factorsAreLoading || !Array.isArray(factors)) && (
							<Loader component='tr' />
						)}
						{Array.isArray(factors) ? (
							factors.map(factor => (
								<Factor
									key={factor.id}
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
			<Box sx={{ flex: 1, display: 'flex', justifyContent: 'space-between' }}>
				<Button variant='contained' onClick={handleDialog}>
					Add Factor
				</Button>
				{/* <Button onClick={handleIdxModal}>Test IDX</Button> */}
				{hasWebAuthn && (
					<div>
						<WebAuthNButton
							variant='contained'
							color='secondary'
							discover='true'
						>
							Discoverable WebAuthn
						</WebAuthNButton>
						<WebAuthNButton variant='contained'>Test WebAuthn</WebAuthNButton>
					</div>
				)}
			</Box>
			{user && (
				<FactorDialog
					open={dialogIsOpen}
					onClose={handleDialog}
					user={user?.sub}
				/>
			)}
			<IdxModal open={idxModalIsOpen} onClose={handleIdxModal} />
		</Fragment>
	);
};
