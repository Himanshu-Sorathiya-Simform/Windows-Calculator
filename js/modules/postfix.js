import { operatorMap, specialValue } from '../keyMappings.js';

function buildPostfixExpression(expression) {
	const operands = [];
	const holdingStack = [];

	for (let char of expression) {
		if (specialValue[char]) char = specialValue[char];

		if (/^\d+(\.\d+)?$/.test(char)) operands.push(char);
		else if (char === '(' || char === '⌈') holdingStack.push(char);
		else if (char === ')') {
			while (holdingStack.length && holdingStack.at(-1) !== '(') {
				operands.push(holdingStack.pop());
			}

			holdingStack.pop();
		} else if (char === '⌉') {
			while (holdingStack.length && holdingStack.at(-1) !== '⌈') {
				operands.push(holdingStack.pop());
			}

			operands.push(holdingStack.pop());
		} else if (char === 'UM' || char === 'UP') {
			while (
				holdingStack.length &&
				operatorMap[char].precedence <
					operatorMap[holdingStack.at(-1)]?.precedence
			) {
				operands.push(holdingStack.pop());
			}

			holdingStack.push(char);
		} else if (operatorMap[char]) {
			while (
				holdingStack.length &&
				operatorMap[char].precedence <=
					operatorMap[holdingStack.at(-1)]?.precedence
			) {
				operands.push(holdingStack.pop());
			}

			holdingStack.push(char);
		}
	}

	while (holdingStack.length !== 0) {
		operands.push(holdingStack.pop());
	}

	return operands;
}

export { buildPostfixExpression };
