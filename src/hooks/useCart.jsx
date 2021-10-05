/** @format */

import { useContext } from 'react';
import { CartContext } from '../contexts';

export const useCart = () => {
	const ctx = useContext(CartContext);

	return {
		...ctx,
	};
};
