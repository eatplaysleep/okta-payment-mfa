/** @format */
import swal from 'sweetalert';
import { Button } from '../../../components';
import { useAuthDispatch, useAuthState } from '../../../providers';

export const WebAuthNButton = props => {
	const dispatch = useAuthDispatch();
	const { issueMFA, factors } = useAuthState();
	const { factor, children, discover } = props || {};

	const onClick = () =>
		issueMFA(dispatch, { method: 'webauthn', factors, factor, discover }).then(
			resp => {
				let options = {
					title: 'Success!',
					text: 'Thank you for completing our additional security verification.',
					button: 'Continue',
					icon: 'success',
				};

				if (!resp) {
					options = {
						...options,
						title: 'Uh oh!',
						text: 'Something went wrong. We are so sorry!',
						button: 'Drats',
						icon: 'error',
					};
				}

				return swal(options);
			}
		);

	return (
		<Button onClick={onClick} {...props}>
			{children ?? 'Try me'}
		</Button>
	);
};
