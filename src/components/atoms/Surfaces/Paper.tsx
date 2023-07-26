/** @format */
import { useTheme, Paper as MuiPaper } from '@mui/material';

import type { PaperProps as MuiPaperProps } from '@mui/material';

export const Paper = (props: PaperProps) => {
	const { background: backgroundColor = 'main', classes, className, padding = false, sx, ...rest } = props;

	const theme = useTheme();

	return (
		<MuiPaper
			square
			elevation={0}
			sx={{ backgroundColor, padding: padding ? theme.spacing(1) : undefined, ...sx }}
			{...{ className, ...rest }}
		/>
	);
};

export interface PaperProps extends MuiPaperProps {
	isRequired?: boolean;
	background?: 'dark' | 'light' | 'main';
	padding?: boolean;
}
