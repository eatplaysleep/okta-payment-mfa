/** @format */

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ErrorBoundary } from 'react-error-boundary';

import RootApp from './RootApp';
import './styles/index.css';
import reportWebVitals from './reportWebVitals';

const ErrorHandler = ({ error }) => {
	return (
		<div role='alert'>
			<p>Something went wrong:</p>
			<pre style={{ color: 'red' }}>{error.message}</pre>
		</div>
	);
};

ReactDOM.render(
	<React.StrictMode>
		<Router>
			<div>
				<ErrorBoundary
					FallbackComponent={ErrorHandler}
					// onReset={() => dispatch({ type: 'DISMISS_ERROR' })}
				>
					<RootApp />
				</ErrorBoundary>
			</div>
		</Router>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
