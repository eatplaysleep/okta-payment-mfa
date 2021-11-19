/** @format */

import * as React from 'react';
import MuiAlert from '@mui/material/Alert';

export const Alert = React.forwardRef((props, ref) => (
	<MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
));
