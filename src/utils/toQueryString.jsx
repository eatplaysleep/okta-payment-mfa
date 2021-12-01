/** @format */

export const toQueryString = obj => {
	let str = [];
	if (obj) {
		for (const [key, value] of Object.entries(obj)) {
			if (value) {
				let output;
				if (typeof value === 'string') {
					output = encodeURIComponent(value);
				} else if (Array.isArray(value)) {
					output = value.join('+');
				}

				str.push(key + '=' + output);
			}
		}
	}
	if (str.length) {
		return '?' + str.join('&');
	} else {
		return '';
	}
};
