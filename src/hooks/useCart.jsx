/** @format */

import { useContext } from 'react';
import { CartContext } from '../providers';

export const useCart = () => {
	const ctx = useContext(CartContext);

	return {
		...ctx,
	};
};
