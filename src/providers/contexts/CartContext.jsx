/** @format */

import React, { createContext, useReducer } from 'react';
import { CartReducer, sumItems } from '../reducers';

export const CartContext = createContext();

const storage = localStorage.getItem('cart')
	? JSON.parse(localStorage?.getItem('cart'))
	: [];

const initialState = {
	cartItems: storage,
	checkout: false,
	activeStep: 0,
	totalSteps: 3,
	...sumItems(storage),
};

export const CartProvider = ({ children }) => {
	const [state, dispatch] = useReducer(CartReducer, initialState);

	const increase = payload => dispatch({ type: 'INCREASE', payload });

	const decrease = payload => dispatch({ type: 'DECREASE', payload });

	const addProduct = payload => dispatch({ type: 'ADD_ITEM', payload });

	const removeProduct = payload => dispatch({ type: 'REMOVE_ITEM', payload });

	const clearCart = () => dispatch({ type: 'CLEAR' });

	const nextStep = () => dispatch({ type: 'NEXT_STEP' });

	const handleCheckout = () => {
		nextStep();
		dispatch({ type: 'CHECKED_OUT' });
	};

	const previousStep = () => dispatch({ type: 'PREVIOUS_STEP' });

	const contextValues = {
		removeProduct,
		addProduct,
		increase,
		decrease,
		clearCart,
		handleCheckout,
		nextStep,
		previousStep,
		...state,
	};

	return (
		<CartContext.Provider value={contextValues}>
			{children}
		</CartContext.Provider>
	);
};
