/** @format */
import { useEffect, useRef } from 'react';
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { v4 as uuidv4 } from 'uuid';
import { authConfig } from '../../../config';
import { useAuthDispatch, useAuthActions } from '../../../providers';

export const OktaSignInWidget = () => {
	const widgetRef = useRef();
	const dispatch = useAuthDispatch();
	const { login } = useAuthActions();

	let config = {
		...authConfig.oidc,
		baseUrl: process.env.REACT_APP_OKTA_URL,
		authParams: {
			issuer: authConfig.oidc.issuer,
			pkce: authConfig.oidc.pkce,
		},
		stateToken: uuidv4(),
		useInteractionCodeFlow: true,
	};

	delete config.issuer;
	delete config.pkce;

	console.debug(JSON.stringify(config, null, 2));

	useEffect(() => {
		const onSuccess = tokens => login(dispatch, { tokens: tokens });
		const onError = err =>
			dispatch({ type: 'LOGIN_ERROR', payload: { error: err } });

		if (!widgetRef.current) {
			return false;
		}

		const signIn = new OktaSignIn({ ...config });
		signIn
			.showSignInToGetTokens({ el: widgetRef.current })
			.then(onSuccess)
			.catch(onError);

		return () => signIn.remove();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div ref={widgetRef} />;
};
