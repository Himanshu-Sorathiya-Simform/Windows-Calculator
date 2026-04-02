import {
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
} from './helpers.js';
import { keyMap, operatorMap, specialValue } from './keyMappings.js';

const keypad = document.querySelector('.calculator__keypad');
const input = document.querySelector('.calculator__input');
const errorDisplay = document.querySelector('.calculator__error');
const calculatorBoard = document.querySelector('.calculator__board');

const history = JSON.parse(localStorage.getItem('history')) || [];

for (const [preview, answer, expiry] of history) {
	insertHistoryCard(preview, answer);
}

const calculator = {
	isCeilOpen: false,
	expression: [],
	operands: [],
	holdingStack: [],
	solution: [],
	numString: '',
	answer: 0,

	handleClick: function (e) {
		const key = e.target.closest('.calculator__key')?.getAttribute('data-key');

		if (!key) return;

		if (key === 'clear') {
			this.clearDisplay();
			return;
		}

		if (key === 'backspace') {
			this.handleBackspace();
			return;
		}

		if (key === 'equals') {
			this.calculateExpression();
			return;
		}

		if (key === 'ceiling' && this.isCeilOpen) {
			this.isCeilOpen = false;
			input.value = input.value + keyMap.get(key).displayClose;
			return;
		} else if (key === 'ceiling' && !this.isCeilOpen) {
			this.isCeilOpen = true;
		}

		input.value = input.value + keyMap.get(key).display;
		input.focus();
	},
	handleKeyboard: function (e) {
		if (e.key === 'Enter' || e.key === '=') {
			e.preventDefault();

			this.calculateExpression();
			return;
		}
	},
	tokenizeExpression: function () {
		const value = input.value;

		for (let i = 0; i < input.value.length; i++) {
			if (isOperand(value[i]) || value[i] === '.') {
				this.numString += value[i];
			} else if (isOpeningBracket(value[i]) || isOpeningCeil(value[i])) {
				if (this.numString) {
					this.expression.push(this.numString, '*');
					this.numString = '';
				}

				this.expression.push(value[i]);
			} else if (
				isSimpleOperator(value[i]) ||
				isClosingBracket(value[i]) ||
				isClosingCeil(value[i])
			) {
				if (this.numString) {
					this.expression.push(this.numString);
					this.numString = '';
				}

				this.expression.push(value[i]);
			} else if (isSpecialOperator(value.slice(i, i + 3))) {
				this.expression.push(value.slice(i, i + 3));

				i += 2;
			} else if (isSpecialOperator(value.slice(i, i + 2))) {
				this.expression.push(value.slice(i, i + 2));

				i += 1;
			} else if (isSpecialChar(value[i])) {
				if (this.numString) {
					this.expression.push(this.numString, '*');
					this.numString = '';
				} else if (isSpecialChar(this.expression.at(-1))) {
					this.expression.push('*');
				}

				this.expression.push(value[i]);
			} else {
				throw new Error('Invalid Expression');
			}
		}

		if (this.numString) {
			this.expression.push(this.numString);
			this.numString == '';
		}
	},
	calculateExpression: function () {
		try {
			this.tokenizeExpression();

			if (!this.expression.length) throw new Error('Please Enter a Expression');

			for (let char of this.expression) {
				if (isSpecialChar(char)) char = specialValue[char];

				if (isOperand(char)) this.operands.push(char);
				else if (isOpeningBracket(char) || isOpeningCeil(char))
					this.holdingStack.push(char);
				else if (isClosingBracket(char)) {
					while (
						this.holdingStack.length &&
						!isOpeningBracket(this.holdingStack.at(-1))
					) {
						this.operands.push(this.holdingStack.pop());
					}

					this.holdingStack.pop();
				} else if (isClosingCeil(char)) {
					while (
						this.holdingStack.length &&
						!isOpeningCeil(this.holdingStack.at(-1))
					) {
						this.operands.push(this.holdingStack.pop());
					}

					this.operands.push(this.holdingStack.pop());
				} else if (isSimpleOperator(char)) {
					while (
						this.holdingStack.length &&
						operatorMap[char].precedence <=
							operatorMap[this.holdingStack.at(-1)]?.precedence
					) {
						this.operands.push(this.holdingStack.pop());
					}

					this.holdingStack.push(char);
				} else if (isSpecialOperator(char)) {
					this.holdingStack.push(char);
				}
			}

			while (this.holdingStack.length !== 0) {
				this.operands.push(this.holdingStack.pop());
			}

			for (const char of this.operands) {
				this.solution.push(char);

				if (isSimpleOperator(char) && operatorMap[char].operands === 2) {
					const operator = this.solution.pop();
					const operand2 = +this.solution.pop();
					const operand1 = +this.solution.pop();

					this.solution.push(
						String(calculateBinary(operator, operand1, operand2)),
					);
				} else if (
					(isSimpleOperator(char) || isSpecialOperator(char)) &&
					operatorMap[char].operands === 1
				) {
					const operator = this.solution.pop();
					const operand1 = +this.solution.pop();

					this.solution.push(String(calculateUnary(operator, operand1)));
				}
			}

			this.answer = this.solution.pop();

			if (
				['undefined', 'null', 'NaN', undefined, null, NaN].includes(this.answer)
			) {
				throw new Error('Invalid Expression');
			}

			this.handleHistory();

			input.value = this.answer;

			this.expression = [];
			this.operands = [];
			this.holdingStack = [];
			this.solution = [];
			this.numString = '';
			errorDisplay.textContent = '';
			this.isCeilOpen = false;
		} catch (error) {
			errorDisplay.textContent = error.message;
		}
	},
	handleHistory: function () {
		history.push([this.expression.join(''), this.answer]);

		insertHistoryCard(this.expression.join(''), this.answer);

		localStorage.setItem('history', JSON.stringify(history));
	},
	clearDisplay: function () {
		input.value = '';
		this.expression = [];
		this.operands = [];
		this.holdingStack = [];
		this.solution = [];
		this.numString = '';
	},
	handleBackspace: function () {
		input.value = input.value.slice(0, -1);
	},
};

keypad.addEventListener('click', (e) => calculator.handleClick(e));

document.body.addEventListener('keydown', (e) => calculator.handleKeyboard(e));

function putValueFromHistory(e) {
	if (e instanceof KeyboardEvent && e.key !== 'Enter') {
		return;
	}

	e.stopPropagation();

	const value = e.target
		.closest('.history__card')
		.querySelector('.history__preview').textContent;

	input.value = value;
}

calculatorBoard.addEventListener('click', (e) => putValueFromHistory(e));
calculatorBoard.addEventListener('keydown', (e) => putValueFromHistory(e));
