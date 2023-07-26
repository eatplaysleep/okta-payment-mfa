/** @format */

import PropTypes from 'prop-types';

import { withStyles } from '@mui/styles';
import MuiTypography from '@mui/material/Typography';

import type { Theme, TypographyClasses, TypographyProps as MuiTypographyProps } from '@mui/material';

const markStyleMapping: MarkStyleMapping = {
	center: {
		h1: '',
		h2: 'markedH2Center',
		h3: 'markedH3Center',
		h4: 'markedH4Center',
		h5: '',
		h6: '',
	},
	left: {
		h1: '',
		h2: '',
		h3: '',
		h4: '',
		h5: '',
		h6: 'markedH6Left',
	},
	none: {
		h1: '',
		h2: '',
		h3: '',
		h4: '',
		h5: '',
		h6: '',
	},
};

const styles = (theme: Theme) => ({
	[markStyleMapping.center.h2]: {
		height: 4,
		width: 73,
		display: 'block',
		margin: `${theme.spacing(1)} auto 0`,
		backgroundColor: theme.palette.secondary.main,
	},
	[markStyleMapping.center.h3]: {
		height: 4,
		width: 55,
		display: 'block',
		margin: `${theme.spacing(1)} auto 0`,
		backgroundColor: theme.palette.secondary.main,
	},
	[markStyleMapping.center.h4]: {
		height: 4,
		width: 55,
		display: 'block',
		margin: `${theme.spacing(1)} auto 0`,
		backgroundColor: theme.palette.secondary.main,
	},
	[markStyleMapping.left.h6]: {
		height: 2,
		width: 28,
		display: 'block',
		marginTop: theme.spacing(0.5),
		background: 'currentColor',
	},
});

const variantMapping = {
	h1: 'h1',
	h2: 'h1',
	h3: 'h1',
	h4: 'h1',
	h5: 'h3',
	h6: 'h2',
	subtitle1: 'h3',
};

const TypographyRoot = (props: TypographyProps) => {
	const { children, variant, classes, marked = 'none', ...other } = props;

	let markedClassName;

	if (classes && marked && variant && variant in markStyleMapping[marked]) {
		const _class = markStyleMapping[marked][variant];

		if (_class) {
			markedClassName = classes[_class as keyof TypographyClasses];
		}
	}

	return (
		<MuiTypography variantMapping={variantMapping} variant={variant} {...other}>
			{children}
			{markedClassName ? <span className={markedClassName} /> : null}
		</MuiTypography>
	);
};

TypographyRoot.propTypes = {
	/**
	 * The content of the component.
	 */
	children: PropTypes.node,
	/**
	 * Override or extend the styles applied to the component.
	 */
	classes: PropTypes.object.isRequired,
	marked: PropTypes.oneOf(['center', 'left', 'none']),
	/**
	 * Applies the theme typography styles.
	 * @default 'body1'
	 */
	variant: PropTypes.oneOf([
		'body1',
		'body2',
		'button',
		'caption',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'inherit',
		'overline',
		'subtitle1',
		'subtitle2',
	]),
};

export const Typography = withStyles(styles)(TypographyRoot);

export interface TypographyProps extends MuiTypographyProps {
	marked?: 'none' | 'center' | 'left';
	component?: React.ElementType;
}

interface MarkStyleMapping {
	center: MarkStyleMappingTypographyClasses;
	left: MarkStyleMappingTypographyClasses;
	none: MarkStyleMappingTypographyClasses;
}

interface MarkStyleMappingTypographyClasses
	extends Omit<Partial<TypographyClasses>, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> {
	h1: TypographyClasses['h1'];
	h2: TypographyClasses['h2'];
	h3: TypographyClasses['h3'];
	h4: TypographyClasses['h4'];
	h5: TypographyClasses['h5'];
	h6: TypographyClasses['h6'];
}
