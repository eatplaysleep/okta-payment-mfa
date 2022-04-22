/** @format */
import swal from 'sweetalert';
import { LoadingButton } from '../../../components';
import { useAuthActions, useAuthDispatch, useAuthState } from '../../../providers';

export const WebAuthNButton = (props) => {
	const dispatch = useAuthDispatch();
	const { factors } = useAuthState();
	const { issueMFA } = useAuthActions();
	const { factor, children, discover } = props || {};

	const onClick = () =>
		issueMFA(dispatch, { method: 'webauthn', factors, factor, discover }).then((resp) => {
			let options = {
				title: 'Success!',
				text: 'Thank you for completing our additional security verification.',
				button: 'Continue',
				icon: 'success',
			};

			if (!resp?.success && resp?.message) {
				options = {
					...options,
					title: 'Uh oh!',
					text: resp.message,
					button: 'Drats',
					icon: 'error',
				};
			} else if (!resp?.success) {
				return;
			}

			return swal(options);
		});

	return (
		<LoadingButton onClick={onClick} {...props}>
			{children ?? 'Try me'}
		</LoadingButton>
	);
};
