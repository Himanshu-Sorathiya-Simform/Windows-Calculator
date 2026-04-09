import { operatorMap, specialValue } from '../keyMappings.js';

function tokenizeExpression(expressionString) {
	let numString = '';
	const expression = [];
	let roundBrackets = 0;
	let ceilBrackets = 0;

	function addNumber(...args) {
		if (numString) {
			expression.push(numString, ...args);
			numString = '';
		}
	}

	for (let i = 0; i < expressionString.length; i++) {
		if (/^\d+(\.\d+)?$/.test(expressionString[i]) || expressionString[i] === '.') {
			numString += expressionString[i];
		} else if (expressionString[i] === '(') {
			roundBrackets++;

			if (expressionString[i - 1] === ')') expression.push('*');

			addNumber('*');

			expression.push(expressionString[i]);
		} else if (expressionString[i] === '⌈') {
			ceilBrackets++;

			addNumber('*');

			expression.push(expressionString[i]);
		} else if (
			expressionString[i] === '+' &&
			!numString &&
			(expression.length === 0 || operatorMap[expression.at(-1)])
		) {
			expression.push('UP');
		} else if (
			expressionString[i] === '-' &&
			!numString &&
			(expression.length === 0 || operatorMap[expression.at(-1)])
		) {
			expression.push('UM');
		} else if (expressionString.slice(i, i + 3) === 'log') {
			addNumber('*');

			expression.push(expressionString.slice(i, i + 3));

			i += 2;
		} else if (expressionString.slice(i, i + 2) === 'ln') {
			addNumber('*');

			expression.push(expressionString.slice(i, i + 2));

			i += 1;
		} else if (operatorMap[expressionString[i]]) {
			if (expressionString[i] === ')') roundBrackets--;

			if (expressionString[i] === '⌉') ceilBrackets--;

			addNumber();

			expression.push(expressionString[i]);
		} else if (specialValue[expressionString[i]]) {
			addNumber('*');

			if (specialValue[expression.at(-1)]) {
				expression.push('*');
			}

			expression.push(expressionString[i]);
		} else {
			throw new Error('Invalid Expression');
		}
	}

	addNumber();

	if (!expression.length) throw new Error('Please Enter a Expression');

	if (roundBrackets || ceilBrackets) throw new Error('Please Enter valid Expression');

	return expression;
}

export { tokenizeExpression };
