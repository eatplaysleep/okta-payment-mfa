/** @format */

import { useOktaAuth } from '@okta/okta-react';
import { Button } from './Button';

const config = {
	clientId: '0oa1k5awvnbwjML2Y1d7',
	clienSecret: '_dlFlejtC7TZVlqh-eDUaxmQaLI4jcgBROu7UJYx',
};

export const WebAuthButton = props => {
	// eslint-disable-next-line no-unused-vars
	const { authState, oktaAuth } = useOktaAuth();

	const login = async () => {
		const transaction = await oktaAuth.idx.authenticate({
			username: 'danny@atko.email',
		});

		console.log(transaction);
	};

	const onClick = () => login();

	props = {
		onClick: onClick,
		children: 'Login',
		color: 'inherit',
		...props,
	};
	return <Button {...props} />;
};
