/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { useEffect, useState } from 'react';
import {
	Box,
	IconButton,
	Dialog,
	DialogContent,
	DialogTitle,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
// import { URL } from 'url';

// const URL = process.env.REACT_APP_STEP_UP_URL;
const PROMPT = 'login';
const RESPONSE_MODE = 'okta_post_message';

const CustomDialog = styled(Dialog)(({ theme }) => ({
	'& .MuiPaper-root': {
		padding: 0,
		overflowY: 'unset',
		margin: 0,
		background: 'none',
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
	const { open, onClose, loginhint } = props;

	const { authClient, oktaAuth } = useOktaAuth();
	const [src, setSrc] = useState();

	const getUrl = () => {
		let tokenParams;

		const currentConfig = oktaAuth.options;
		const newConfig = {
			// clientId: '0oa120ptzojjj3hj50h8',
			clientId: '0oa1kn96tkmBaXZPN1d7',
			responseMode: 'okta_post_message',
		};

		return setSrc(
			() =>
				'https://expedia-oie.dannyfuhriman.com/home/oidc_client/0oa1kn96tkmBaXZPN1d7/aln177a159h7Zf52X0g8'
		);
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

	// https://expedia-oie.dannyfuhriman.com/home/oidc_client/0oa1kn96tkmBaXZPN1d7/aln177a159h7Zf52X0g8

	// const src2 = `https://expedia-oie.dannyfuhriman.com/oauth2/aus1gb3zbtlqNoCUK1d7/v1/authorize?client_id=0oa1kn96tkmBaXZPN1d7&response_type=code&scope=openid&redirect_uri=http://localhost:3000/login/callback&state=c2i6yuaNNRN1fGb8r0w1uhzKTbDwEq87oa3MSzsio9frd4uztxrlR8y3WU21fueY&nonce=88Uh8NqtyKgyuWYI4nwckGaTCiVIxBZrjWPnjHexoSvkxhYttMToHzJKgf5XPKQd&code_challenge=qq40HN9-BkfGbW2KMkEzmW02irW35pB8PU88ivtIaf8&code_challenge_method=S256&response_mode=okta_post_message`;

	useEffect(() => getUrl(), []);
	useEffect(() => {
		const handler = e => {
			// console.log('event:', JSON.stringify(e?.data, null, 2));
			// const data = JSON.parse(e?.data);
			// console.log('post data:', data);
		};

		window.addEventListener('message', handler);

		return () => window.removeEventListener('message', handler);
	}, []);

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
				{src && (
					<iframe
						src={src}
						// srcDoc={`
						// <!DOCTYPE html>
						// <html>
						// 	<script>
						// 		window.top.postMessage(
						// 			JSON.stringify({
						// 				error: false,
						// 				message: "Hello world!"
						// 			}),
						// 			'*'
						// 		);
						// 	</script>
						// 	<body>
						// 			<h1>Stuff in an iFrame!</h1>
						// 	</body>
						// </html>
						// `}
						name='step-up-auth'
						width='400'
						height='650'
						frameBorder='0'
						style={{ display: 'block', borderRadius: '4px' }}
						// referrerPolicy='same-origin'
					/>
				)}
			</DialogContent>
		</CustomDialog>
	);
};
