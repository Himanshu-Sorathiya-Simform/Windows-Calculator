function factorial(num: number): number {
	if (num <= 1) return 1;

	return num * factorial(num - 1);
}

function calculateUnary(operator: string, operand: number): number {
	switch (operator) {
		case 'UM':
			return -1 * operand;

		case 'UP':
			return +1 * operand;

		case '⌈':
			return Math.ceil(operand);

		case '²√':
			return Math.sqrt(operand);

		case '³√':
			return Math.pow(operand, 1 / 3);

		case '!':
			if (!Number.isInteger(operand)) {
				throw new Error('Factorial can only be of integers');
			}

			return factorial(operand);

		case 'log':
			return Math.log10(operand);

		case 'ln':
			return Math.log(operand);

		default:
			return operand;
	}
}

function calculateBinary(operator: string, operand1: number, operand2: number): number {
	switch (operator) {
		case '^':
			return operand1 ** operand2;

		case '+':
			return operand1 + operand2;

		case '-':
			return operand1 - operand2;

		case '%':
			return operand1 % operand2;

		case '/':
			return operand1 / operand2;

		case '*':
			return operand1 * operand2;

		default:
			return operand1;
	}
}

export { calculateBinary, calculateUnary };
