const calculatorBoard = document.querySelector('.calculator__board');

function factorial(num) {
	if (num <= 1n) return 1n;

	return num * factorial(num - 1n);
}

function insertHistoryCard(preview, answer) {
	const historyCard = `
			<button class="history__card">
				<p class="history__preview">${preview}</p>

				<p class="history__answer">${answer}</p>
			</button>
		`;

	calculatorBoard.insertAdjacentHTML('afterbegin', historyCard);
}

const calculateUnary = (operator, op1) => {
	switch (operator) {
		case '⌈':
			return Math.ceil(op1);

		case '√':
			return Math.sqrt(op1);

		case '!':
			return factorial(BigInt(op1));

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
const isSimpleOperator = (value) => /[⌈√!^+\-*/%]/.test(value);
const isSpecialOperator = (value) => /^(log|ln)$/.test(value);

const isOpeningBracket = (value) => /^\($/.test(value);
const isClosingBracket = (value) => /^\)$/.test(value);
const isOpeningCeil = (value) => /^\⌈$/.test(value);
const isClosingCeil = (value) => /^\⌉$/.test(value);

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
