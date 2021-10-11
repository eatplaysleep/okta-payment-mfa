/** @format */

import { Fragment, useEffect, useState } from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogTitle,
	DialogContent,
} from '@mui/material';
import { FactorList } from './index';
import CryptoUtil from '../../utils/cryptoUtil';

export const FactorDialog = props => {
	const { open, user, onClose, onChange } = props;

	const [availableFactors, setAvailableFactors] = useState();
	const [factor, enrollFactor] = useState();

	const onSelect = event => {
		event.preventDefault();

		enrollFactor(() => event?.target?.value);
	};

	useEffect(() => {
		const url = `${window.location.origin}/api/${user}/factors/catalog`;

		if (!availableFactors) {
			return fetch(url)
				.then(resp => {
					if (resp.ok) {
						return resp.json();
					}
				})
				.then(resp => setAvailableFactors(() => resp))
				.catch(err => console.error(err));
		}
	}, [availableFactors]);

	useEffect(() => {
		const enrollWebAuthN = () => {
			const url = `${window.location.origin}/api/${user}/factors`;

			const request = {
				factorType: 'webauthn',
				provider: 'FIDO',
			};

			const options = {
				method: 'post',
				body: JSON.stringify(request),
			};

			return fetch(url, options)
				.then(resp => {
					if (resp.ok) {
						return resp.json();
					}
				})
				.then(resp => {
					const _embedded = resp?._embedded?.activation,
						user = _embedded?.user,
						factorId = resp?.id,
						challenge = _embedded?.challenge,
						rp = _embedded?.rp,
						attestation = _embedded?.attestation,
						pubKeyCredParams = _embedded?.pubKeyCredParams;

					let publicKey = {
						status: resp?.status,
						challenge: CryptoUtil.strToBin(challenge),
						rp: rp,
						user: {
							...user,
							id: CryptoUtil.strToBin(user.id),
						},
						attestation: attestation,
						pubKeyCredParams: pubKeyCredParams,
						authenticatorSelection: {
							authenticatorAttachment: 'platform',
						},
					};

					console.log(JSON.stringify(publicKey, null, 2));

					navigator.credentials
						.create({ publicKey })
						.then(resp => {
							const attestation = CryptoUtil.binToStr(
									resp?.response?.attestationObject
								),
								clientData = CryptoUtil.binToStr(
									resp?.response?.clientDataJSON
								),
								requestData = {
									attestation: attestation,
									clientData: clientData,
								},
								url = `${window.location.origin}/api/${user?.id}/factors/${factorId}/activate`,
								options = {
									method: 'post',
									body: JSON.stringify(requestData),
								};

							return fetch(url, options)
								.then(resp => {
									if (resp.ok) {
										return resp.json();
									}
								})
								.then(() => onClose())
								.catch(err => console.error(err));
						})
						.catch(err => console.error(err));
				})
				.catch(err => console.error(err));
		};

		if (factor) {
			switch (factor) {
				case 'webauthn':
					enrollFactor(() => undefined);
				default:
					return;
			}
		}
	}, [factor]);

	return (
		<Fragment>
			<Dialog open={open} onClose={onClose}>
				<DialogTitle>Enroll Factor</DialogTitle>
				<DialogContent>
					{availableFactors?.length > 0 && (
						<FactorList factors={availableFactors} onChange={onSelect} />
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
};
