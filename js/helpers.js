function factorial(num) {
	if (num <= 1) return 1;

	return num * factorial(num - 1);
}

const calculateUnary = (operator, operand) => {
	switch (operator) {
		case 'UM':
			return -1 * operand;

		case 'UP':
			return +1 * operand;

		case '⌈':
			return Math.ceil(operand);

		case '√':
			return Math.sqrt(operand);

		case '!':
			if (!Number.isInteger(operand)) {
				throw new Error('Factorial can only be of integers');
			}

			return factorial(operand);

		case 'log':
			return Math.log10(operand);

		case 'ln':
			return Math.log(operand);
	}
};

const calculateBinary = (operator, operand1, operand2) => {
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
	}
};

export { calculateBinary, calculateUnary };
