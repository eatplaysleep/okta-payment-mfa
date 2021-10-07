/** @format */

import { useEffect, useState } from 'react';
import { Button } from './index';
import CryptoUtil from '../../utils/cryptoUtil';

export const WebAuthNButton = props => {
	const { factor, user } = props;

	const url = `${window.location.origin}/api/${user}/factors/${factor}/verify`;

	const onClick = () => {
		return fetch(url)
			.then(resp => {
				if (resp.ok) {
					return resp.json();
				}
			})
			.then(resp => {
				const allowCredentials = [
					{
						id: CryptoUtil.strToBin(resp?.profile?.credentialId),
						type: 'public-key',
						transports: ['internal'],
					},
				];

				resp._embedded.challenge.challenge = CryptoUtil.strToBin(
					resp?._embedded?.challenge?.challenge
				);

				const publicKey = {
					...resp?._embedded.challenge,
					allowCredentials: allowCredentials,
					userVerification: 'required',
				};

				return navigator.credentials
					.get({ publicKey: publicKey })
					.then(assertion => {
						const request = {
							method: 'post',
							body: JSON.stringify({
								authenticatorData: CryptoUtil.binToStr(
									assertion?.response?.authenticatorData
								),
								clientData: CryptoUtil.binToStr(
									assertion?.response?.clientDataJSON
								),
								signatureData: CryptoUtil.binToStr(
									assertion?.response?.signature
								),
							}),
						};

						return fetch(url, request)
							.then(resp => {
								if (resp.ok) {
									return resp.json();
								}
							})
							.then(resp => {
								console.info('success');
								let result = 'Something went wrong';

								if (resp?.factorResult === 'SUCCESS') {
									result = 'Successfully authenticated!';
								}
								return window.alert(result);
							})
							.catch(err => console.error(err));
					});
			})
			.catch(err => console.error(err));
	};

	return <Button onClick={onClick}>Authenticate</Button>;
};
