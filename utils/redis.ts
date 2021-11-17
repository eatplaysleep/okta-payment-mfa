/** @format */

import { PublicKeyCreateOptions } from '../types';
import Redis = require('ioredis');

const REDIS_URL = process.env.REDIS_URL;

const redis = new Redis(REDIS_URL);

export const dbGet = async (key: string) => {
	try {
		// fetch the data
		const result = await redis.get(key);

		/// base64 decode the data
		const data: PublicKeyCreateOptions | PublicKeyCredentialCreationOptions =
			JSON.parse(Buffer.from(result, 'base64').toString('utf-8'));

		return data;
	} catch (err) {
		throw new Error(err);
	}
};

export const dbSet = async (key: string, data: any) => {
	try {
		/// base64 encode the data for simplicity
		const encodedData = Buffer.from(JSON.stringify(data), 'utf-8').toString(
			'base64'
		);

		/// persist response to redis
		const result = await redis.set(key, encodedData);

		if (result === 'OK') {
			return true;
		} else throw 'Unable to store data!';
	} catch (err) {
		throw new Error(err);
	}
};
