/** @format */

import { Fragment, useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';
import { FactorList } from '../../../components';
import { useAuthActions, useAuthState, useAuthDispatch } from '../../../providers';

export const FactorDialog = (props) => {
	const { open, userId, onClose } = props;
	const dispatch = useAuthDispatch();
	const { fetchAvailableFactors } = useAuthActions();
	const { enrollMFA, isLoadingFactorCatalog, availableFactors } = useAuthState();

	const [factor, enrollFactor] = useState();

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

	useEffect(() => {
		if (factor) {
			return enrollMFA(dispatch, userId, factor).then((resp) => {
				if (resp) {
					dispatch({ type: 'REFRESH_FACTORS' });
					return onClose();
				}
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [factor]);

	return (
		<Fragment>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>Enroll Factor</DialogTitle>
				<DialogContent>
					{availableFactors?.length > 0 && <FactorList factors={availableFactors} onChange={onSelect} />}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
