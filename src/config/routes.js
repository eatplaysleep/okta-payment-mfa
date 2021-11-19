/** @format */
import {
	AppLoginCallback,
	Cart,
	Checkout,
	Home,
	Privacy,
	Profile,
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
	{
		path: '/me',
		component: Profile,
		isExact: true,
		isSecure: true,
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
