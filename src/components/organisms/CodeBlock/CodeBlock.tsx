import JSONPretty from 'react-json-pretty';
import 'react-json-pretty/themes/monikai.css';

export interface CodeBlockProps {
	data?: string | object;
}

const CodeBlock = ({ data }: CodeBlockProps) => {
	data = typeof data === 'string' ? data : JSON.stringify(data);

	return <JSONPretty {...{ id: 'json', data, mainStyle: 'padding:1em; margin:0' }} />;
};

export default CodeBlock;
