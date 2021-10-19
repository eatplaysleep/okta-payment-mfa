/** @format */

// import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import { IconButton, Dialog, DialogContent, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import swal from 'sweetalert';
import { Loader } from './index';
import { useAuthDispatch, useAuthState } from '../../providers';

// const URL = process.env.REACT_APP_STEP_UP_URL;
// const PROMPT = 'login';
// const RESPONSE_MODE = 'okta_post_message';

const CustomDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiPaper-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
		background: 'white',
	},
	'& .MuiDialog-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
	},
	'& .MuiDialogContent-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
	},
	'& .MuiDialogTitle-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
	},
}));

export const AuthModal = props => {
	const { onClose } = props;
	const dispatch = useAuthDispatch();
	const { authModalIsVisible, isLoading, iFrameIsVisible } = useAuthState();

	const [src, setSrc] = useState();

	const onCancel = () => {
		dispatch({ type: 'STEP_UP_CANCEL' });
		return onClose();
	};

	const getUrl = () => {
		// let tokenParams;

		// const currentConfig = oktaAuth.options;
		// const newConfig = {
		// clientId: '0oa120ptzojjj3hj50h8',
		// clientId: '0oa1kn96tkmBaXZPN1d7',
		// responseMode: 'okta_post_message',
		// };

		const url = process.env.REACT_APP_STEP_UP_URL;

		return setSrc(() => url);
		// return oktaAuth.token
		// 	.prepareTokenParams()
		// 	.then(resp => {
		// 		tokenParams = resp;

		// 		delete resp.codeVerifier;
		// 		delete resp.ignoreSignature;
		// 		delete resp.pkce;

		// 		const url = new URL(currentConfig.issuer),
		// 			searchParams = {
		// 				...resp,
		// 				...newConfig,
		// 			};
		// 		console.log(JSON.stringify(searchParams, null, 2));
		// 		url.pathname = '/v1/authorize';

		// 		for (const [key, value] of Object.entries(searchParams)) {
		// 			url.searchParams.append(key, value);
		// 		}
		// 		console.log(url.toString());
		// 		return setSrc(() => url.toString());
		// 	})
		// 	.catch(err => console.error(err));
	};

	useEffect(() => getUrl(), []);
	useEffect(() => {
		const handler = ({ origin, data }) => {
			switch (data?.type) {
				case 'onload':
					if (data?.result === 'success') {
						return dispatch({ type: 'STEP_UP_STARTED' });
					}
					break;
				case 'callback':
					if (origin !== window.location.origin) {
						return;
					}
					let options = {
						title: 'Success!',
						text: 'Thank you for completing our additional security verification.',
						button: 'Continue',
						icon: 'success',
					};

					if (data?.result === 'success') {
						dispatch({
							type: 'STEP_UP_SUCCESS',
							payload: { authModalIsVisible: false },
						});
					} else {
						dispatch({
							type: 'STEP_UP_ERROR',
							payload: { authModalIsVisible: false },
						});

						options = {
							...options,
							title: 'Uh oh!',
							text: 'Something went wrong. We are so sorry!',
							button: 'Drats',
							icon: 'error',
						};
					}

					return swal(options);
				default:
					break;
			}

			// onClose();
		};

		window.addEventListener('message', handler);

		return () => window.removeEventListener('message', handler);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<CustomDialog open={authModalIsVisible} onClose={onClose}>
			<DialogTitle>
				<IconButton
					edge='end'
					size='small'
					onClick={onCancel}
					sx={{
						color: 'white',
						position: 'absolute',
						borderRadius: 25,
						background: 'rgba(0, 0, 0, 0.53)',
						right: -15,
						top: -15,
						'z-index': '10',
					}}
				>
					<CloseIcon />
				</IconButton>
			</DialogTitle>
			<DialogContent sx={{ width: '400px', height: '650px' }}>
				{isLoading && <Loader />}
				{/* <Loader /> */}
				{src && iFrameIsVisible && (
					<iframe
						src={src}
						name='step-up-auth'
						title='Step Up Auth'
						width='400'
						height='650'
						frameBorder='0'
						style={{ display: 'block', borderRadius: '4px' }}
						allow='publickey-credentials-get http://localhost https://expedia-oie.dannyfuhriman.com'
					/>
				)}
			</DialogContent>
		</CustomDialog>
	);
};
