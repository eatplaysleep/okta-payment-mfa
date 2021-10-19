/** @format */

import { Grid } from '@mui/material';
import { ProductItem } from '../../components';
import { useProducts } from '../../hooks';

export const ProductsGrid = () => {
	const { products } = useProducts();

	return (
		<Grid container spacing={5}>
			{products.map(product => (
				<ProductItem key={product.id} product={product} />
			))}
		</Grid>
	);
};
