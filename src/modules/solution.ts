import { calculateBinary, calculateUnary } from '../helpers.js';
import { operatorMap } from '../keyMappings.js';

function solveExpression(expression: string[], realExpression: string[], func?: string) {
	const solution = [];

	for (const char of expression) {
		solution.push(char);

		if (operatorMap[char]?.operands === 2) {
			const operator: string = solution.pop() ?? '';
			const operand2: string = solution.pop() ?? '0';
			const operand1: string = solution.pop() ?? '0';

			solution.push(String(calculateBinary(operator || '', +operand1, +operand2)));
		} else if (operatorMap[char]?.operands === 1) {
			const operator: string = solution.pop() ?? '';
			const operand: string = solution.pop() ?? '0';

			solution.push(String(calculateUnary(operator, +operand)));
		}
	}

	if (solution.length !== 1) throw new Error('Please Enter valid Expression');

	const [answer, newExpression] = applyFunction(solution.pop(), realExpression, func);

	if (['undefined', 'null', 'NaN'].includes(answer))
		throw new Error('Please Enter valid Expression');

	return [+answer, newExpression] as [number, string[]];
}

function applyFunction(answer: string | undefined, expression: string[], func?: string) {
	if (func && answer) {
		switch (func) {
			case 'absolute':
				answer = '' + Math.abs(+answer);
				expression.unshift('|');
				expression.push('|');
				break;

			case 'ceil':
				answer = '' + Math.ceil(+answer);
				expression.unshift('⌈');
				expression.push('⌉');
				break;

			case 'floor':
				answer = '' + Math.floor(+answer);
				expression.unshift('⌊');
				expression.push('⌋');
				break;

			case 'round':
				answer = '' + Math.round(+answer);
				expression.unshift('[');
				expression.push(']');
				break;

			case 'sin':
				answer = '' + Math.sin(+answer / (180 / Math.PI));
				expression.unshift('sin(');
				expression.push(')');
				break;

			case 'cos':
				answer = '' + Math.cos(+answer / (180 / Math.PI));
				expression.unshift('cos(');
				expression.push(')');
				break;

			case 'tan':
				answer = '' + Math.tan(+answer / (180 / Math.PI));
				expression.unshift('tan(');
				expression.push(')');
				break;

			case 'sec':
				answer = '' + 1 / Math.cos(+answer / (180 / Math.PI));
				expression.unshift('sec(');
				expression.push(')');
				break;

			case 'cosec':
				answer = '' + 1 / Math.sin(+answer / (180 / Math.PI));
				expression.unshift('cosec(');
				expression.push(')');
				break;

			case 'cot':
				answer = '' + 1 / Math.tan(+answer / (180 / Math.PI));
				expression.unshift('cot(');
				expression.push(')');
				break;
		}
	}

	return [answer, expression] as [string, string[]];
}

export { solveExpression };
