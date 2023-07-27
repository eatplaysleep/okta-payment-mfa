/** @format */

import { Button, CircularProgress, Container, Dialog, DialogActions, DialogTitle, DialogContent } from '@mui/material';

import { FactorList } from 'components';
import { useAuthActions, useAuthState, useAuthDispatch, useGetAvailableFactors } from 'hooks';

import type { DialogProps } from '@mui/material';

export const FactorDialog = ({ sx, ...props }: DialogProps) => {
	const dispatch = useAuthDispatch();
	const { enrollMFA } = useAuthActions();
	const { user } = useAuthState();

	const { data: availableFactors = [], isFetching: isLoadingFactorCatalog } = useGetAvailableFactors();

	const onClick: React.MouseEventHandler<HTMLButtonElement> = ({ currentTarget }) =>
		enrollMFA(dispatch, user?.sub, currentTarget?.getAttribute('data-factorType')?.toLowerCase());

	return (
		<Dialog sx={{ minWidth: '250px', ...sx }} {...props}>
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
					<Container sx={{ display: 'flex', alignContent: 'center', alignItems: 'stretch', justifyContent: 'center' }}>
						<CircularProgress color='secondary' />
					</Container>
				)}
				{!isLoadingFactorCatalog && availableFactors?.length > 0 && (
					<FactorList factors={availableFactors} {...{ onClick }} />
				)}
			</DialogContent>
			<DialogActions>
				<Button onClick={props?.onClose as React.MouseEventHandler<HTMLButtonElement> | undefined}>Cancel</Button>
			</DialogActions>
		</Dialog>
	);
};
