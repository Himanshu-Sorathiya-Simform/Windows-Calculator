import { calculateBinary, calculateUnary } from '../helpers.js';
import { operatorMap } from '../keyMappings.js';

function solveExpression(expression, realExpression, func) {
	const solution = [];

	for (const char of expression) {
		solution.push(char);

		if (operatorMap[char]?.operands === 2) {
			const operator = solution.pop();
			const operand2 = +solution.pop();
			const operand1 = +solution.pop();

			solution.push(String(calculateBinary(operator, operand1, operand2)));
		} else if (operatorMap[char]?.operands === 1) {
			const operator = solution.pop();
			const operand = +solution.pop();

			solution.push(String(calculateUnary(operator, operand)));
		}
	}

	if (solution.length !== 1) throw new Error('Please Enter valid Expression');

	const [answer, newExpression] = applyFunction(solution.pop(), realExpression, func);

	if (['undefined', 'null', 'NaN', undefined, null, NaN].includes(answer))
		throw new Error('Please Enter valid Expression');

	return [answer, newExpression];
}

function applyFunction(answer, expression, func) {
	if (func) {
		switch (func) {
			case 'absolute':
				answer = Math.abs(answer);
				expression.unshift('|');
				expression.push('|');
				break;

			case 'ceil':
				answer = Math.ceil(answer);
				expression.unshift('⌈');
				expression.push('⌉');
				break;

			case 'floor':
				answer = Math.floor(answer);
				expression.unshift('⌊');
				expression.push('⌋');
				break;

			case 'round':
				answer = Math.round(answer);
				expression.unshift('[');
				expression.push(']');
				break;

			case 'sin':
				answer = Math.sin(answer / (180 / Math.PI));
				expression.unshift('sin(');
				expression.push(')');
				break;

			case 'cos':
				answer = Math.cos(answer / (180 / Math.PI));
				expression.unshift('cos(');
				expression.push(')');
				break;

			case 'tan':
				answer = Math.tan(answer / (180 / Math.PI));
				expression.unshift('tan(');
				expression.push(')');
				break;

			case 'sec':
				answer = 1 / Math.cos(answer / (180 / Math.PI));
				expression.unshift('sec(');
				expression.push(')');
				break;

			case 'cosec':
				answer = 1 / Math.sin(answer / (180 / Math.PI));
				expression.unshift('cosec(');
				expression.push(')');
				break;

			case 'cot':
				answer = 1 / Math.tan(answer / (180 / Math.PI));
				expression.unshift('cot(');
				expression.push(')');
				break;
		}
	}

	return [answer, expression];
}

export { solveExpression };
