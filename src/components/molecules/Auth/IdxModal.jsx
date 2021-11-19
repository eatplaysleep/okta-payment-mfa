/** @format */

import { useEffect, useState } from 'react';
import {
	Box,
	DialogContent,
	DialogTitle,
	IconButton,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EmailIcon from '@mui/icons-material/Email';
import PasswordIcon from '@mui/icons-material/Password';
import SmsIcon from '@mui/icons-material/Sms';
// import swal from 'sweetalert';
import { AuthDialog, Button, Loader, TextField } from '../../../components';
import {
	useAuthActions,
	useAuthDispatch,
	useAuthState,
} from '../../../providers';

export const IdxModal = props => {
	const { open, onClose } = props || {};
	const dispatch = useAuthDispatch();
	const { isLoading, authStep } = useAuthState() || {};
	const { idxLogin } = useAuthActions() || {};
	const [formData, updateForm] = useState();
	const [content, setContent] = useState();
	// const [buttonId, setButtonId] = useState();

	const modalWidth = '400px',
		modalHeight = '650px';

	const onCancel = () => {
		dispatch({ type: 'LOGIN_CANCEL' });
		return onClose();
	};

	const handleClick = e => {
		e.preventDefault();

		console.debug(e);

		let id = e.target?.id,
			input = {};

		switch (id) {
			case 'select-authenticator-authenticate':
				input.authenticator = id;
				break;
			case 'identify':
				input.username = formData?.username;
				break;
			default:
				break;
		}

		idxLogin(dispatch, { input }).then(resp => {
			console.debug('resp:', JSON.stringify(resp, null, 2));
		});
	};

	const handleChange = e => {
		e.preventDefault();

		let id = e.target.id,
			value = e.target?.value;

		updateForm(() => ({ ...formData, [id]: value }));
	};

	useEffect(() => {
		const renderInputs = inputs => {
			let data = [];

			if (Array.isArray(inputs) && inputs.length > 0) {
				let props = {
					margin: 'normal',
					variant: 'standard',
					fullWidth: true,
				};

				inputs.map(input => {
					props = {
						...props,
						id: input?.name,
						name: input?.name,
						label: input?.label,
					};

					switch (input?.name) {
						case 'password':
							props = {
								...props,
								type: input?.name,
								required: true,
								autoComplete: 'current-password',
								onChange: handleChange,
							};
							break;
						case 'username':
							props = {
								...props,
								type: input?.name,
								required: true,
								autoFocus: true,
								onChange: handleChange,
							};
							break;
						default:
							break;
					}

					return data.push(<TextField key={input.name} {...props} />);
				});
			}
			return setContent(() => data);
		};

		const renderAuthenticators = authenticators => {
			let data = [];
			if (Array.isArray(authenticators) && authenticators.length > 0) {
				authenticators.map(authenticator => {
					let icon,
						props = {
							key: `authenticator-${authenticator?.value}`,
						};

					switch (authenticator?.value) {
						case 'email':
							icon = <EmailIcon />;
							break;
						case 'password':
							icon = <PasswordIcon />;
							break;
						case 'sms':
							icon = <SmsIcon />;
							break;
						default:
							break;
					}

					return data.push(
						<ListItem {...props}>
							<ListItemButton id={authenticator?.value} onClick={handleClick}>
								<ListItemIcon>{icon}</ListItemIcon>
								<ListItemText primary={authenticator?.label} />
							</ListItemButton>
						</ListItem>
					);
				});
			}
			return setContent(() => <List>{data}</List>);
		};

		switch (authStep?.nextStep?.name) {
			case 'identify':
				renderInputs(authStep?.nextStep?.inputs);
				break;
			case 'select-authenticator-authenticate':
				renderAuthenticators(authStep?.nextStep?.options);
				break;
			default:
				break;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [authStep?.nextStep]);

	return (
		<AuthDialog open={open} onClose={onClose}>
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
			<DialogContent sx={{ m: 4, width: modalWidth, height: modalHeight }}>
				{isLoading && <Loader />}
				<Box component='form'>
					{content}
					<Button
						id={authStep?.nextStep?.name ?? 'next-btn'}
						onClick={handleClick}
						color='secondary'
						variant='contained'
						sx={{ mt: 2 }}
						fullWidth
					>
						Next
					</Button>
				</Box>
			</DialogContent>
		</AuthDialog>
	);
};
