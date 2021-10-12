/** @format */

const Storage = cartItems => {
	localStorage.setItem('cart', JSON.stringify(cartItems ?? []));
};

export const sumItems = cartItems => {
	Storage(cartItems);
	let itemCount = cartItems.reduce(
		(total, product) => total + product.quantity,
		0
	);
	let total = cartItems
		.reduce((total, product) => total + product.price * product.quantity, 0)
		.toFixed(2);
	return { itemCount, total };
};

export const CartReducer = (state, action) => {
	console.debug(action?.type);
	switch (action?.type) {
		case 'ADD_ITEM':
			if (!state.cartItems.find(item => item.id === action.payload.id)) {
				state.cartItems.push({
					...action.payload,
					quantity: 1,
				});
			}

			return {
				...state,
				...sumItems(state.cartItems),
				cartItems: [...state.cartItems],
			};
		case 'REMOVE_ITEM':
			return {
				...state,
				...sumItems(
					state.cartItems.filter(item => item.id !== action.payload.id)
				),
				cartItems: [
					...state.cartItems.filter(item => item.id !== action.payload.id),
				],
			};
		case 'INCREASE':
			state.cartItems[
				state.cartItems.findIndex(item => item.id === action.payload.id)
			].quantity++;
			return {
				...state,
				...sumItems(state.cartItems),
				cartItems: [...state.cartItems],
			};
		case 'DECREASE':
			state.cartItems[
				state.cartItems.findIndex(item => item.id === action.payload.id)
			].quantity--;
			return {
				...state,
				...sumItems(state.cartItems),
				cartItems: [...state.cartItems],
			};
		case 'CHECKED_OUT':
			return {
				cartItems: [],
				checkout: true,
				...sumItems([]),
			};
		case 'CLEAR':
			return {
				cartItems: [],
				...sumItems([]),
			};
		case 'NEXT_STEP':
			if (state?.activeStep < state?.totalSteps) {
				state = {
					...state,
					activeStep: state?.activeStep + 1,
				};
			}
			return { ...state };
		case 'PREVIOUS_STEP':
			if (state?.activeStep !== 0) {
				return {
					...state,
					activeStep: state?.activeStep < 1 ? 0 : state?.activeStep - 1,
				};
			}
			break;
		default:
			return state;
	}
};
