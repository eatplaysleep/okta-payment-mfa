import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vercel from 'vite-plugin-vercel';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
	return {
		plugins: [vercel(), react(), tsconfigPaths()],
		server: {
			port: 3000,
		},
	};
});
