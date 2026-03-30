const input = document.querySelector('.calculator__input');

const operatorPrecedence = (operator) => {
	switch (operator) {
		case '(':
		case ')':
			return undefined;

		case '*':
		case '/':
		case '%':
			return 12;

		case '+':
		case '-':
			return 11;

		default:
			return 0;
	}
};

const calculateBinary = (operator, op1, op2) => {
	switch (operator) {
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

const getExpression = () => input.value.split(/([+\-*/%])/).filter(Boolean);

const isOperand = (value) => /^\d+$/.test(value);
const isClosing = (value) => /([)])/.test(value);

export { calculateBinary, getExpression, isClosing, isOperand, operatorPrecedence };
