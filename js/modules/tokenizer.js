import { operatorMap, specialValue } from '../keyMappings.js';

const TOKEN_REGEX = /\d+(\.\d+)?|log|ln|³√|²√|[()^+\-*/!πe]/g;

function isNumber(token) {
	return /^\d+(\.\d+)?$/.test(token);
}

function isOperator(token) {
	return !!operatorMap[token];
}

function isSpecialValue(token) {
	return !!specialValue[token];
}

function isFunction(token) {
	return token === 'log' || token === 'ln' || token === '²√' || token === '³√';
}

function tokenizeExpression(input) {
	const rawTokens = input.match(TOKEN_REGEX);

	if (!rawTokens || rawTokens.join('').length !== input.length) {
		throw new Error('Invalid Expression');
	}

	const tokens = [];
	let roundBrackets = 0;

	for (let i = 0; i < rawTokens.length; i++) {
		let token = rawTokens[i];
		let prev = tokens.at(-1);

		if (token === '(') {
			roundBrackets++;

			if (prev && (isNumber(prev) || prev === ')')) {
				tokens.push('*');
			}

			tokens.push(token);
		} else if (token === '+' || token === '-') {
			if (!prev || isOperator(prev)) {
				tokens.push(token === '+' ? 'UP' : 'UM');
			} else {
				tokens.push(token);
			}
		} else if (token === '!') {
			if (!prev || (!isNumber(prev) && prev !== ')')) {
				throw new Error('Please enter Factorial at correct place');
			}

			tokens.push(token);
		} else if (isFunction(token)) {
			if (prev && (isNumber(prev) || prev === ')')) {
				tokens.push('*');
			}

			tokens.push(token);
		} else if (isNumber(token)) {
			if (prev === ')') {
				tokens.push('*');
			}

			tokens.push(token);
		} else if (isOperator(token)) {
			if (token === ')') roundBrackets--;

			tokens.push(token);
		} else if (isSpecialValue(token)) {
			if (prev && (isNumber(prev) || isSpecialValue(prev))) {
				tokens.push('*');
			}

			tokens.push(token);
		} else {
			throw new Error('Invalid Expression');
		}
	}

	if (!tokens.length) {
		throw new Error('Please Enter an Expression');
	}

	if (roundBrackets !== 0) {
		throw new Error('Please Enter valid Expression');
	}

	return tokens;
}

export { tokenizeExpression };
