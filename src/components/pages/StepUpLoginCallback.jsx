/** @format */
import { useEffect } from 'react';
import { Loader } from '../../components';
import { useAuthState, useAuthDispatch } from '../../providers';

const { VITE_ORIGIN = '' } = import.meta.env;

const ORIGINS = VITE_ORIGIN.split(' ');

const ORIGIN = ORIGINS.find((u) => u === window.location.origin);

export const StepUpLoginCallback = () => {
	const { login } = useAuthState();
	const dispatch = useAuthDispatch();

	useEffect(() => {
		return login(dispatch, { isStepUp: true }).then(() => {
			dispatch({ type: 'STEP_UP_COMPLETE' });
			window.top.postMessage(
				{
					error: false,
					type: 'callback',
					result: 'success',
				},
				ORIGIN
			);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div>
			<Loader />
		</div>
	);
};
