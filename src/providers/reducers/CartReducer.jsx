const Storage = (cartItems) => {
	localStorage.setItem('cart', JSON.stringify(cartItems ?? []));
};

export const sumItems = (cartItems, dispatch) => {
	Storage(cartItems);
	let itemCount = cartItems.reduce((total, product) => total + product.quantity, 0);
	let total = cartItems.reduce((total, product) => total + product.price * product.quantity, 0).toFixed(2);

	if (dispatch) {
		dispatch({ type: 'STEP_UP_STATUS_UPDATED', payload: { isStepUpRequired: total >= 30 } });
	}

	return { itemCount, total };
};

export const CartReducer = (state, action) => {
	console.debug(action?.type);
	switch (action?.type) {
		case 'ADD_ITEM':
			if (!state.cartItems.find((item) => item.id === action?.product?.id)) {
				state.cartItems.push({
					...action.product,
					quantity: 1,
				});
			}

			return {
				...state,
				...sumItems(state.cartItems, action?.authDispatch),
				cartItems: [...state.cartItems],
			};
		case 'REMOVE_ITEM':
			return {
				...state,
				...sumItems(
					state.cartItems.filter((item) => item.id !== action?.product?.id),
					action?.authDispatch
				),
				cartItems: [...state.cartItems.filter((item) => item.id !== action?.product?.id)],
			};
		case 'INCREASE':
			state.cartItems[state.cartItems.findIndex((item) => item.id === action?.product?.id)].quantity++;
			return {
				...state,
				...sumItems(state.cartItems),
				cartItems: [...state.cartItems],
			};
		case 'DECREASE':
			state.cartItems[state.cartItems.findIndex((item) => item.id === action?.product?.id)].quantity--;
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
