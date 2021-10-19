/** @format */
import { lazy } from 'react';
import {
	AppLoginCallback,
	Cart,
	Privacy,
	StepUpLoginCallback,
	Terms,
} from '../components';

const Home = lazy(() => import('../components/pages/Home'));
const Checkout = lazy(() => import('../components/pages/Checkout'));
const Profile = lazy(() => import('../components/pages/Profile'));
const SignInSide = lazy(() => import('../components/pages/SignInSide'));
const Store = lazy(() => import('../components/pages/Store'));

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
