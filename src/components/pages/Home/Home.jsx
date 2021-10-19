/** @format */

import * as React from 'react';
import {
	ProductCategories,
	ProductCTA,
	ProductHero,
	ProductHowItWorks,
	ProductSmokingHero,
	ProductValues,
	withRoot,
} from '../../../components';

const HomeRoot = () => (
	<React.Fragment>
		<ProductHero />
		<ProductValues />
		<ProductCategories />
		<ProductHowItWorks />
		<ProductCTA />
		<ProductSmokingHero />
	</React.Fragment>
);

export const Home = withRoot(HomeRoot);
