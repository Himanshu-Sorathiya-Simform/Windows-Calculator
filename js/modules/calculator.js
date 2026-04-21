import { keyMap, operatorMap } from '../keyMappings.js';
import { history } from '../main.js';

import { buildPostfixExpression } from './postfix.js';
import { solveExpression } from './solution.js';
import { tokenizeExpression } from './tokenizer.js';

import { insertHistoryCard } from '../handlers/historyHandler.js';

const input = document.querySelector('.calculator__input');
const errorDisplay = document.querySelector('.calculator__error');

const keypad = document.querySelector('.calculator__keypad');
const keypadInverseButton = document.querySelector('[data-key="inverse"]');

const calculator = {
	expression: [],
	postfix: [],
	answer: 0,

	getLastNumber: function () {
		const match = input.value.match(/[\d.]+$/);

		return match ? match[0] : '';
	},
	handleClick: function (e) {
		const key = e.target.closest('.calculator__key')?.getAttribute('data-key');

		if (!key) return;

		if (key === 'inverse') {
			keypad.classList.toggle('hide');
			keypadInverseButton.classList.toggle('calculator__key--accent');

			return;
		}

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

		if (['absolute', 'ceil', 'floor', 'round'].includes(key)) {
			this.calculateExpression(key);
			return;
		}

		if (key === 'random') {
			input.value = input.value + Math.random().toFixed(5);
			return;
		}

		if (
			input.value &&
			[
				'reciprocal',
				'ten_power',
				'two_power',
				'square_root',
				'cube_root',
				'logarithm',
				'natural_log',
			].includes(key) &&
			!operatorMap[input.value.at(-1)]
		) {
			const num = this.getLastNumber();

			input.value =
				input.value.slice(0, -num.length) + keyMap.get(key).display + num;

			if (['logarithm', 'natural_log', 'square_root', 'cube_root'].includes(key))
				input.value += keyMap.get('right_parenthesis').display;

			return;
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
	calculateExpression: function (func) {
		this.expression = [];
		this.postfix = [];
		this.answer = 0;

		try {
			this.expression = tokenizeExpression(input.value);

			this.postfix = buildPostfixExpression(this.expression);

			[this.answer, this.expression] = solveExpression(
				this.postfix,
				this.expression,
				func,
			);

			this.handleHistory();

			input.value = this.answer;

			errorDisplay.textContent = '';
		} catch (error) {
			errorDisplay.textContent = error.message;
		}
	},
	handleHistory: function () {
		const expr = this.expression
			.map((t) =>
				t === 'UM' ? '-'
				: t === 'UP' ? '+'
				: t,
			)
			.join('');

		history.push([expr, this.answer]);
		insertHistoryCard(expr, this.answer);
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
