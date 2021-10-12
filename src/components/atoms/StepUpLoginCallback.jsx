/** @format */
import { useEffect } from 'react';
import { Loader } from '.';
import { useAuthState, useAuthDispatch } from '../../providers';

const ORIGIN = process.env.REACT_APP_ORIGIN;

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
