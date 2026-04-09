import { keyMap } from '../keyMappings.js';
import { history } from '../main.js';

import { buildPostfixExpression } from './postfix.js';
import { solveExpression } from './solution.js';
import { tokenizeExpression } from './tokenizer.js';

import { insertHistoryCard } from '../handlers/historyHandler.js';

const input = document.querySelector('.calculator__input');
const errorDisplay = document.querySelector('.calculator__error');

const calculator = {
	expression: [],
	postfix: [],
	solution: [],
	isCeilOpen: false,
	answer: 0,

	addNumber: function (...args) {
		if (this.numString) {
			this.expression.push(this.numString, ...args);
			this.numString = '';
		}
	},
	handleClick: function (e) {
		const key = e.target.closest('.calculator__key')?.getAttribute('data-key');

		if (!key) return;

		if (key === 'clear') {
			this.clearDisplay();
			errorDisplay.textContent = '';
			return;
		}

		if (key === 'backspace') {
			this.handleBackspace();
			errorDisplay.textContent = '';
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
		if (e.key !== 'Tab') input.focus();

		if (e.key === 'Escape') {
			e.preventDefault();

			this.clearDisplay();
			return;
		}

		if (e.key === 'Enter' || e.key === '=') {
			e.preventDefault();

			this.calculateExpression();
			return;
		}
	},
	calculateExpression: function () {
		this.expression = [];
		this.postfix = [];
		this.isCeilOpen = false;
		this.answer = 0;

		try {
			this.expression = tokenizeExpression(input.value);

			this.postfix = buildPostfixExpression(this.expression);

			this.answer = solveExpression(this.postfix);

			this.expression = input.value;

			this.handleHistory();

			input.value = this.answer;

			errorDisplay.textContent = '';
		} catch (error) {
			errorDisplay.textContent = error.message;
			throw new Error(error);
		} finally {
			this.expression = [];
			this.postfix = [];
			this.numString = '';
			this.isCeilOpen = false;
		}
	},
	handleHistory: function () {
		history.push([this.expression, this.answer]);

		insertHistoryCard(this.expression, this.answer);

		localStorage.setItem('history', JSON.stringify(history));
	},
	clearDisplay: function () {
		input.value = '';
	},
	handleBackspace: function () {
		input.value = input.value.slice(0, -1);
	},
};

export { calculator };
