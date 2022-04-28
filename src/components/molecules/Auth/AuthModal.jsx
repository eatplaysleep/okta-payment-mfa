/** @format */

import { useEffect } from 'react';
import { IconButton, DialogContent, DialogTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import swal from 'sweetalert';
import { AuthDialog, Loader } from '../../../components';
import { useAuthActions, useAuthDispatch, useAuthState } from '../../../providers';

const ENV = process.env.NODE_ENV;
const OKTA_ORIGINS = ['https://expedia-oie.dannyfuhriman.com', 'https://udp-expedia-oie.oktapreview.com'];
const ALLOWED_ORIGINS_PROD = ['https://expedia-fido.dannyfuhriman.com', ...OKTA_ORIGINS];
const ALLOWED_ORIGINS_DEV = ['http://localhost', ...OKTA_ORIGINS];
const ALLOWED_ORIGINS = ENV === 'production' ? ALLOWED_ORIGINS_PROD : ALLOWED_ORIGINS_DEV;
const IFRAME_ALLOW = `publickey-credentials-get ${ALLOWED_ORIGINS.join(' ')}`;

export const AuthModal = (props) => {
	const { onClose } = props;
	const dispatch = useAuthDispatch();
	const { isVisibleAuthModal, isLoadingLogin, isVisibleIframe, authUrl } = useAuthState();
	const { login } = useAuthActions();

	const modalWidth = '400px';
	const modalHeight = '650px';

	const onCancel = () => {
		dispatch({ type: 'LOGIN_CANCELLED' });
		return onClose();
	};
	useEffect(() => {
		const responseHandler = ({ origin, data }) => {
			const isAllowed = ALLOWED_ORIGINS.includes(origin);

			if (!isAllowed) {
				return dispatch({
					type: 'LOGIN_IFRAME_FAILED',
					error: `'origin' [${origin}] not allowed`,
				});
			}

			if (data?.code) {
				login(dispatch, data);
			} else {
				switch (data?.type) {
					case 'onload':
						if (data?.result === 'success') {
							return dispatch({ type: 'LOGIN_IFRAME_LOADED' });
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
			}
		};

		const resolve = (error) => {
			if (error) {
				throw error;
			}

			console.debug('removing listener...');
			window.removeEventListener('message', responseHandler);
		};

		if (isVisibleAuthModal) {
			console.debug('adding listener...');
			window.addEventListener('message', responseHandler);
		}

		return () => resolve();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isVisibleAuthModal]);

	return (
		<AuthDialog open={isVisibleAuthModal} onClose={onClose}>
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
			<DialogContent sx={{ width: modalWidth, height: modalHeight }}>
				{isLoadingLogin && <Loader />}
				{authUrl && isVisibleIframe && (
					<iframe
						src={authUrl}
						name='iframe-auth'
						title='Login'
						width={modalWidth}
						height={modalHeight}
						frameBorder='0'
						style={{ display: 'block', borderRadius: '4px' }}
						allow={IFRAME_ALLOW}
					/>
				)}
			</DialogContent>
		</AuthDialog>
	);
};
