/** @format */
import { useEffect } from 'react';
import { Loader } from '.';
import { useAuthState, useAuthDispatch } from '../../providers';

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
				'http://localhost:3000'
			);
		});
	}, []);

	return (
		<div>
			<Loader />
		</div>
	);
};
