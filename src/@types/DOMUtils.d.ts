import '@types/history/DOMUtils';

declare global {
	interface Event {
		origin: string;
		data?: {
			type: Event['type'];
			code?: string;
			result?: 'success' | string;
		};
	}
}
