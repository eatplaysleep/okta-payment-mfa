/** @format */

// import { useOktaAuth } from '@okta/okta-react';
import {
	Box,
	IconButton,
	Dialog,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const URL = process.env.REACT_APP_STEP_UP_URL;
const PROMPT = 'login';
const RESPONSE_MODE = 'okta_post_message';

const CustomDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiPaper-root': {
		padding: 0,
		'overflow-y': 'unset',
		margin: 0,
		background: 'none',
	},
	'& .MuiDialog-root': {
		padding: 0,
		'overflow-y': 'unset',
		margin: 0,
	},
	'& .MuiDialogContent-root': {
		padding: 0,
		'overflow-y': 'unset',
		margin: 0,
	},
	'& .MuiDialogTitle-root': {
		padding: 0,
		'overflow-y': 'unset',
		margin: 0,
	},
}));

export const AuthModal = props => {
	const { open, onClose, loginhint } = props;

	// const { oktaAuth } = useOktaAuth();

	const src = `${URL}?login_hint${loginhint}`;

	return (
		<CustomDialog open={open} onClose={onClose}>
			<DialogTitle>
				<IconButton
					edge='end'
					size='small'
					onClick={onClose}
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
			<DialogContent>
				<iframe
					src={src}
					name='step-up-auth'
					width='400'
					height='650'
					frameBorder='0'
					style={{ display: 'block', borderRadius: '4px' }}
					// referrerPolicy='no-referrer'
				></iframe>
			</DialogContent>
		</CustomDialog>
	);
};
