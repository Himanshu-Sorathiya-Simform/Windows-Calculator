import { keyMap, operatorMap } from '../keyMappings.js';
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

	getLasNumber: function () {
		const match = input.value.match(/[\d.]+$/);

		return match ? match[0] : '';
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

		if (
			input.value &&
			(['reciprocal', 'ten_power', 'root', 'logarithm', 'natural_log'].includes(
				key,
			) ||
				(key === 'ceiling' && !this.isCeilOpen)) &&
			!operatorMap[input.value.at(-1)]
		) {
			const num = this.getLasNumber();

			input.value =
				input.value.slice(0, -num.length) + keyMap.get(key).display + num;

			if (['logarithm', 'natural_log', 'root'].includes(key))
				input.value += keyMap.get('right_parenthesis').display;

			if (key === 'ceiling') input.value += keyMap.get('ceiling').displayClose;

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

		const isControlKey = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(
			e.key,
		);

		if (/[a-zA-Z]/.test(e.key) && !isControlKey) {
			e.preventDefault();
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
