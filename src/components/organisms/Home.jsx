/** @format */

import * as React from 'react';
import {
	ProductCategories,
	ProductCTA,
	ProductHero,
	ProductHowItWorks,
	ProductSmokingHero,
	ProductValues,
} from '../molecules';
import withRoot from '../withRoot';

function Home() {
	return (
		<React.Fragment>
			<ProductHero />
			<ProductValues />
			<ProductCategories />
			<ProductHowItWorks />
			<ProductCTA />
			<ProductSmokingHero />
		</React.Fragment>
	);
}

export default withRoot(Home);
