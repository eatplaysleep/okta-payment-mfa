import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { useAuthState } from 'hooks';

export const useGetAvailableFactors = () => {
	const { user } = useAuthState();

	const queryFn = async () => {
		if (!user?.sub) {
			return [];
		}

		const url = `${window.location.origin}/api/${user?.sub}/factors/catalog`;

		const { data } = await axios<Factor[]>(url);

		return data;
	};

	return useQuery({ queryKey: ['user', 'factors', 'catalog'], queryFn, enabled: !!user?.sub });
};
