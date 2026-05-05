import { operatorMap, specialValue } from '../keyMappings.js';

function buildPostfixExpression(expression: string[]): string[] {
	const operands: string[] = [];
	const holdingStack: string[] = [];

	for (let char of expression) {
		if (specialValue[char]) char = specialValue[char]!;

		if (/^\d+(\.\d+)?$/.test(char)) operands.push(char);
		else if (char === '(') holdingStack.push(char);
		else if (char === ')') {
			while (holdingStack.length && holdingStack.at(-1) !== '(') {
				const top = holdingStack.pop();

				if (top !== undefined) {
					operands.push(top);
				}
			}

			holdingStack.pop();
		} else if (char === 'UM' || char === 'UP') {
			while (
				holdingStack.length &&
				operatorMap[char]!.precedence <
					operatorMap[holdingStack.at(-1)!]!.precedence
			) {
				const top = holdingStack.pop();

				if (top !== undefined) {
					operands.push(top);
				}
			}
			holdingStack.push(char);
		} else if (operatorMap[char]) {
			while (
				holdingStack.length &&
				operatorMap[char]!.precedence <=
					operatorMap[holdingStack.at(-1)!]!.precedence
			) {
				const top = holdingStack.pop();

				if (top !== undefined) {
					operands.push(top);
				}
			}

			holdingStack.push(char);
		}
	}

	while (holdingStack.length !== 0) {
		const top = holdingStack.pop();

		if (top !== undefined) {
			operands.push(top);
		}
	}

	return operands;
}

export { buildPostfixExpression };
