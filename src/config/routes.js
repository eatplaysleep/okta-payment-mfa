/** @format */
import {
	AppLoginCallback,
	Checkout,
	Home,
	Privacy,
	Profile,
	SignInSide,
	Store,
	Terms,
} from '../components';

export const routes = [
	{
		path: '/checkout',
		component: Checkout,
	},
	{
		path: '/login/callback',
		component: AppLoginCallback,
	},
	{
		path: '/login',
		component: SignInSide,
	},
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
