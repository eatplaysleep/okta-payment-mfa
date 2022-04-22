/** @format */

import { Fragment, useEffect } from 'react';
import { Button, CircularProgress, Container, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import { FactorList, Loader } from '../../../components';
import { useAuthActions, useAuthState, useAuthDispatch } from '../../../providers';

export const FactorDialog = (props) => {
	const { open, userId, onClose } = props;
	const dispatch = useAuthDispatch();
	const { enrollMFA, fetchAvailableFactors } = useAuthActions();
	const { isLoadingFactorCatalog, availableFactors } = useAuthState();

	const onSelect = (event) => {
		event.preventDefault();

		const factor = event?.target?.value?.toLowerCase();

		return enrollMFA(dispatch, userId, factor);
	};

	useEffect(() => {
		if (!availableFactors || (Array.isArray(availableFactors) && availableFactors.length < 1)) {
			fetchAvailableFactors(dispatch, userId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [availableFactors, userId]);

	return (
		<Fragment>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>Enroll Factor</DialogTitle>
				<DialogContent
					sx={{
						display: 'flex',
						flexDirection: 'column',
						alignContent: 'center',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					{isLoadingFactorCatalog && (
						<Container
							sx={{ display: 'flex', alignContent: 'center', alignItems: 'stretch', justifyContent: 'center' }}
						>
							<CircularProgress color='secondary' />
						</Container>
					)}
					{!isLoadingFactorCatalog && availableFactors?.length > 0 && (
						<FactorList factors={availableFactors} onChange={onSelect} />
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
