/** @format */

import crypto from 'crypto';

const hash = (type: string, data: Buffer | string): Buffer => {
	return crypto.createHash(type).update(data).digest();
};

export const sha1 = (data: Buffer | string): Buffer => {
	return hash('sha1', data);
};

export const sha256 = (data: Buffer | string): Buffer => {
	return hash('sha256', data);
};

export const createVerify = (algorithm: string) => {
	return crypto.createVerify(algorithm);
};
