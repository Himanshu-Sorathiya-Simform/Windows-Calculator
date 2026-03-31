import {
	calculateBinary,
	calculateUnary,
	isClosingBracket,
	isOpeningBracket,
	isOperand,
	isSimpleOperator,
	isSpecialChar,
	isSpecialOperator,
} from './helpers.js';
import { keyMap, operatorMap, specialValue } from './keyMappings.js';

const keypad = document.querySelector('.calculator__keypad');
const input = document.querySelector('.calculator__input');

const calculator = {
	expression: [],
	operands: [],
	holdingStack: [],
	solution: [],
	numString: '',

	handleDisplay(key) {
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

		input.value = input.value + keyMap.get(key).display;
	},
	updateExpression: function (e) {
		const key = e.target.closest('.calculator__key')?.getAttribute('data-key');

		if (!key) return;

		this.handleDisplay(key);

		//console.log('Expression', this.expressionExpression
		// console.expression('HoldingStack', this.holdingStack);
		// console.log('HoldingStack', this.holdingStack);
		// console.log('Operands', this.operands);
		// console.log('NumString', this.numString);
	},
	tokenizeExpression: function () {
		const value = input.value;

		for (let i = 0; i < input.value.length; i++) {
			if (isOperand(value[i]) || value[i] === '.') {
				this.numString += value[i];
			} else if (isOpeningBracket(value[i])) {
				if (this.numString) {
					this.expression.push(this.numString, '*');
					this.numString = '';
				}

				this.expression.push(value[i]);
			} else if (isSimpleOperator(value[i]) || isClosingBracket(value[i])) {
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
				} else if (
					this.expression.at(-1) === `${Math.PI}` ||
					this.expression.at(-1) === `${Math.E}`
				) {
					this.expression.push('*');
				}

				this.expression.push(specialValue[value[i]]);
			}
		}

		if (this.numString) {
			this.expression.push(this.numString);
			this.numString == '';
		}

		console.log(this.expression);
	},
	calculateExpression() {
		this.tokenizeExpression();

		console.log('-----------------');
		console.log('BEFORE ANYTHING');
		console.log('Expression', this.expression);
		console.log('HoldingStack', this.holdingStack);
		console.log('Operands', this.operands);

		for (const char of this.expression) {
			console.log('-----------------');
			console.log('THIS IS CHAR we working', char);

			if (isOperand(char)) this.operands.push(char);
			else if (isOpeningBracket(char)) this.holdingStack.push(char);
			else if (isClosingBracket(char)) {
				while (
					this.holdingStack.length &&
					!isOpeningBracket(this.holdingStack.at(-1))
				) {
					this.operands.push(this.holdingStack.pop());
				}

				this.holdingStack.pop();
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

			console.log('AFTER EACH CHAR, THIS IS PROCESS');
			console.log('HoldingStack', this.expression);
			console.log('HoldingStack', this.holdingStack);
			console.log('Operands', this.operands);
		}

		console.log('-----------------');
		console.log('THIS IS AFTER FOR LOOP OF EXPRESSION');
		console.log('Expression', this.expression);
		console.log('HoldingStack', this.holdingStack);
		console.log('Operands', this.operands);

		while (this.holdingStack.length !== 0) {
			this.operands.push(this.holdingStack.pop());
		}

		console.log('-----------------');
		console.log('FINAL');
		console.log('Expression', this.expression);
		console.log('HoldingStack', this.holdingStack);
		console.log('Operands', this.operands);

		for (const char of this.operands) {
			this.solution.push(char);

			if (isSimpleOperator(char) && operatorMap[char].operands === 2) {
				const operator = this.solution.pop();
				const operand2 = +this.solution.pop();
				const operand1 = +this.solution.pop();

				this.solution.push(calculateBinary(operator, operand1, operand2));
			} else if (
				(isSimpleOperator(char) || isSpecialOperator(char)) &&
				operatorMap[char].operands === 1
			) {
				const operator = this.solution.pop();
				const operand1 = +this.solution.pop();

				this.solution.push(calculateUnary(operator, operand1));
			}
		}

		input.value = this.solution.pop();
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

keypad.addEventListener('click', (e) => calculator.updateExpression(e));
