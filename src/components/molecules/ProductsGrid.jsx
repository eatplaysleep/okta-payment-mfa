/** @format */

import { Container, Grid } from '@mui/material';
import { ProductItem } from '../atoms';
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
