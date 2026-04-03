const calculatorBoard = document.querySelector('.calculator__board');

// Finding Factorial of any number (Used BigInt to ensure its answer is always accurate)
function factorial(num) {
	if (num <= 1n) return 1n;

	return num * factorial(num - 1n);
}

// Create History Card and add it into history section (aka calculator board)
function insertHistoryCard(preview, answer) {
	const historyCard = `
			<button class="history__card">
				<p class="history__preview">${preview}</p>

				<p class="history__answer">${answer}</p>
			</button>
		`;

	calculatorBoard.insertAdjacentHTML('afterbegin', historyCard);
}

// Calculation of Unary Operators
const calculateUnary = (operator, operand) => {
	switch (operator) {
		case '⌈':
			return Math.ceil(operand);

		case '√':
			return Math.sqrt(operand);

		case '!':
			if (!Number.isInteger(operand)) {
				throw new Error('Factorial can only be of integers');
			}

			return factorial(BigInt(operand));

		case 'log':
			return Math.log10(operand);

		case 'ln':
			return Math.log(operand);
	}
};

// Calculation of Binary Operators
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

// Checking if given value is number or not (15, 17.34 etc)
const isOperand = (value) => /^\d+(\.\d+)?$/.test(value);
// Checking if given value is "one character" operator or not
const isSimpleOperator = (value) => /[⌈√!^+\-*/%]/.test(value);
// Checking if given value is "multi character" operator (log, ln) or not
const isSpecialOperator = (value) => /^(log|ln)$/.test(value);

// Checking if given value is opening bracket "(" or not
const isOpeningBracket = (value) => /^\($/.test(value);
// Checking if given value is closing bracket or ")" not
const isClosingBracket = (value) => /^\)$/.test(value);
// Checking if given value is opening ceil bracket "⌈" or not
const isOpeningCeil = (value) => /^\⌈$/.test(value);
// Checking if given value is closing ceil bracket "⌉" or not
const isClosingCeil = (value) => /^\⌉$/.test(value);

// Checking if given value is "PI" | "EULER" number or not
const isSpecialChar = (value) => /^(π|e)$/.test(value);

export {
	calculateBinary,
	calculateUnary,
	insertHistoryCard,
	isClosingBracket,
	isClosingCeil,
	isOpeningBracket,
	isOpeningCeil,
	isOperand,
	isSimpleOperator,
	isSpecialChar,
	isSpecialOperator,
};
