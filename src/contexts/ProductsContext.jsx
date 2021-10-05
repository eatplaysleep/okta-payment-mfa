/** @format */

import React, { createContext, useState } from 'react';
import { Products } from '../services';

export const ProductsContext = createContext();

export const ProductsContextProvider = ({ children }) => {
	const [products] = useState(Products);

	return (
		<ProductsContext.Provider value={{ products }}>
			{children}
		</ProductsContext.Provider>
	);
};
