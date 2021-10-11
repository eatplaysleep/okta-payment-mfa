/** @format */

import { useContext } from 'react';
import { ProductsContext } from '../providers';

export const useProducts = () => {
	const ctx = useContext(ProductsContext);

	return {
		...ctx,
	};
};
