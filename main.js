import { calculateBinary, isOperand, operatorPrecedence } from './helpers.js';
import { keyMap } from './keyMappings.js';

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

		const keyExpression = keyMap.get(key)?.expression;

		if (isOperand(keyExpression)) this.numString += keyExpression;

		if (keyExpression === '(' || keyExpression === ')') {
			if (this.numString) {
				this.expression.push(this.numString);
				this.numString = '';
			}

			this.expression.push(keyExpression);
		}

		const keyPrecedence = operatorPrecedence(keyExpression);
		if (keyPrecedence) {
			if (this.numString) {
				this.expression.push(this.numString);

				this.numString = '';
			}

			this.expression.push(keyExpression);
		}

		this.handleDisplay(key);

		// console.log('Expression', this.expression);
		// console.log('HoldingStack', this.holdingStack);
		// console.log('Operands', this.operands);
		// console.log('NumString', this.numString);
	},
	calculateExpression() {
		if (this.numString) this.expression.push(this.numString);

		console.log('-----------------');
		console.log('BEFORE ANYTHING');
		console.log('Expression', this.expression);
		console.log('HoldingStack', this.holdingStack);
		console.log('Operands', this.operands);

		for (const char of this.expression) {
			console.log('-----------------');
			console.log('THIS IS CHAR we working', char);

			if (isOperand(char)) this.operands.push(char);
			else if (char === '(') this.holdingStack.push(char);
			else if (char === ')') {
				while (this.holdingStack.length && this.holdingStack.at(-1) !== '(') {
					this.operands.push(this.holdingStack.pop());
				}

				this.holdingStack.pop();
			} else {
				while (
					this.holdingStack.length &&
					operatorPrecedence(char) <=
						operatorPrecedence(this.holdingStack.at(-1))
				) {
					this.operands.push(this.holdingStack.pop());
				}

				this.holdingStack.push(char);
			}

			console.log('AFTER EACH CHAR, THIS IS PROCESS');
			console.log('Expression', this.expression);
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

			if (!isOperand(char)) {
				const operator = this.solution.pop();
				const operand2 = +this.solution.pop();
				const operand1 = +this.solution.pop();

				this.solution.push(calculateBinary(operator, operand1, operand2));
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
		if (isOperand(input.value.at(-1))) {
			this.numString = this.numString.slice(0, -1);
		} else {
			this.expression.pop();
			this.numString = this.expression.pop();
		}

		input.value = input.value.slice(0, -1);
	},
};

keypad.addEventListener('click', (e) => calculator.updateExpression(e));
