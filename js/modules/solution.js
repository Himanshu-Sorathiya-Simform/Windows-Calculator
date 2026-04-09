import { calculateBinary, calculateUnary } from '../helpers.js';
import { operatorMap } from '../keyMappings.js';

function solveExpression(expression) {
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

	const answer = solution.pop();

	if (['undefined', 'null', 'NaN', undefined, null, NaN].includes(answer))
		throw new Error('Please Enter valid Expression');

	return answer;
}

export { solveExpression };
