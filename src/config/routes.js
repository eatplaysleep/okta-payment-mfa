/** @format */
import {
	AppLoginCallback,
	Cart,
	Checkout,
	Home,
	Privacy,
	Profile,
	// SignIn,
	StepUpLoginCallback,
	Store,
	Terms,
} from '../components';

export const routes = [
	{
		path: '/cart',
		component: Cart,
	},
	{
		path: '/checkout',
		component: Checkout,
	},
	{
		path: '/login/callback',
		component: AppLoginCallback,
	},
	{
		path: '/stepup/callback',
		component: StepUpLoginCallback,
	},
	// {
	// 	path: '/login',
	// 	component: SignIn,
	// },
	{
		path: '/me',
		component: Profile,
	},
	{
		path: '/privacy',
		component: Privacy,
	},
	{
		path: '/store',
		component: Store,
	},
	{
		path: '/terms',
		component: Terms,
	},
	{
		path: '/*',
		component: Home,
	},
];
