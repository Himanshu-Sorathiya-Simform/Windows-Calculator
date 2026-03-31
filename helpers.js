function factorial(num) {
	if (num <= 1) return 1;

	return num * factorial(num - 1);
}

const calculateUnary = (operator, op1) => {
	switch (operator) {
		case '√':
			return Math.sqrt(op1);

		case '!':
			return factorial(op1);

		case 'log':
			return Math.log10(op1);

		case 'ln':
			return Math.log(op1);
	}
};

const calculateBinary = (operator, op1, op2) => {
	switch (operator) {
		case '^':
			return op1 ** op2;

		case '+':
			return op1 + op2;

		case '-':
			return op1 - op2;

		case '%':
			return op1 % op2;

		case '/':
			return op1 / op2;

		case '*':
			return op1 * op2;
	}
};

const isOperand = (value) => /^\d+(\.\d+)?$/.test(value);
const isSimpleOperator = (value) => /[√!^+\-*/%]/.test(value);
const isSpecialOperator = (value) => /^(log|ln)$/.test(value);

const isOpeningBracket = (value) => /^\($/.test(value);
const isClosingBracket = (value) => /^\)$/.test(value);

const isSpecialChar = (value) => /^(π|e)$/.test(value);

export {
	calculateBinary,
	calculateUnary,
	isClosingBracket,
	isOpeningBracket,
	isOperand,
	isSimpleOperator,
	isSpecialChar,
	isSpecialOperator
};
