/** @format */

import { Fragment, useEffect, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
} from '@mui/material';
import { FactorList } from '../../../components';
import { useAuthState, useAuthDispatch } from '../../../providers';

export const FactorDialog = props => {
	const { open, user, onClose } = props;
	const dispatch = useAuthDispatch();
	const { enrollMFA } = useAuthState();

	const [availableFactors, setAvailableFactors] = useState();
	const [factor, enrollFactor] = useState();

	const onSelect = event => {
		event.preventDefault();

		enrollFactor(() => event?.target?.value);
	};

	useEffect(() => {
		const url = `${window.location.origin}/api/${user}/factors/catalog`;

		if (!availableFactors) {
			return fetch(url)
				.then(resp => {
					if (resp.ok) {
						return resp.json();
					}
				})
				.then(resp => setAvailableFactors(() => resp))
				.catch(err => console.error(err));
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [availableFactors]);

	useEffect(() => {
		if (factor) {
			return enrollMFA(dispatch, user, factor).then(resp => {
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
					{availableFactors?.length > 0 && (
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
