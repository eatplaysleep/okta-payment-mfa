/** @format */

import { Fragment, useEffect, useState } from 'react';
import { Box, TableBody, TableCell, TableContainer, TableHead, TableRow, Table } from '@mui/material';
import { Button, Factor, FactorDialog, IdxModal, Loader, Typography, WebAuthNButton } from '../../../components';
import { useAuthDispatch, useAuthState, useAuthActions } from '../../../providers';

export const FactorTable = () => {
	const dispatch = useAuthDispatch();
	const {
		user,
		factors,
		fetchFactors,
		// idxModalIsVisible,
		isStale,
		isVisibleFactorDialog,
		factorsAreLoading,
		hasWebAuthn,
	} = useAuthState();
	const { removeFactor } = useAuthActions();

	const [idxModalIsOpen, openIdxModal] = useState(false);

	const handleDialog = () =>
		dispatch({ type: 'FACTOR_ENROLL_DIALOG', payload: { isVisibleFactorDialog: !isVisibleFactorDialog } });

	const handleIdxModal = () => openIdxModal(() => !idxModalIsOpen);

	const handleRemoveFactor = (factorId) => removeFactor(dispatch, { userId: user.sub, factorId });

	useEffect(() => {
		if (user?.sub && (isStale || !factors)) {
			return fetchFactors(dispatch, user.sub);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isStale]);

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
							<TableCell key='try' />
							<TableCell key='remove' />
						</TableRow>
					</TableHead>
					<TableBody>
						{(factorsAreLoading || !Array.isArray(factors)) && <Loader component='tr' />}
						{Array.isArray(factors) ? (
							factors.map((factor) => <Factor key={factor.id} factor={factor} onClick={handleRemoveFactor} />)
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
						<WebAuthNButton variant='contained' color='secondary' discover='true'>
							Discoverable WebAuthn
						</WebAuthNButton>
						<WebAuthNButton variant='contained'>Test WebAuthn</WebAuthNButton>
					</div>
				)}
			</Box>
			{user && <FactorDialog open={isVisibleFactorDialog} onClose={handleDialog} user={user?.sub} />}
			<IdxModal open={idxModalIsOpen} onClose={handleIdxModal} />
		</Fragment>
	);
};
