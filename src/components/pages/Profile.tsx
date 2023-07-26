/** @format */
import { Container } from '@mui/material';
import { CodeBlock, FactorTable, Paper, Typography } from '..';
import { useAuthState } from '../../providers';

export const Profile = () => {
	const { user } = useAuthState();

	return (
		<>
			<Container component='section' sx={{ mt: 8, mb: 4 }}>
				<Typography variant='h4' marked='center' component='h2'>
					Profile
				</Typography>
				<Paper variant='outlined' sx={{ my: { xs: 3, md: 6 } }}>
					<CodeBlock data={user} />
				</Paper>
			</Container>
			<Container component='section' sx={{ mt: 8, mb: 4 }}>
				<Paper variant='outlined' sx={{ marginY: { xs: 3, md: 6 }, padding: { xs: 2, md: 3 } }}>
					<FactorTable />
				</Paper>
			</Container>
		</>
	);
};
