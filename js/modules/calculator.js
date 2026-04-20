import { keyMap, operatorMap } from '../keyMappings.js';
import { history } from '../main.js';

import { buildPostfixExpression } from './postfix.js';
import { solveExpression } from './solution.js';
import { tokenizeExpression } from './tokenizer.js';

import { insertHistoryCard } from '../handlers/historyHandler.js';

const input = document.querySelector('.calculator__input');
const errorDisplay = document.querySelector('.calculator__error');

const squareButton = document.querySelector('[data-key="square"]');
const cubeButton = document.querySelector('[data-key="cube"]');
const squareRootButton = document.querySelector('[data-key="square_root"]');
const cubeRootButton = document.querySelector('[data-key="cube_root"]');
const tenPowerButton = document.querySelector('[data-key="ten_power"]');
const twoPowerButton = document.querySelector('[data-key="two_power"]');

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
			squareButton.classList.toggle('hidden');
			cubeButton.classList.toggle('hidden');
			squareRootButton.classList.toggle('hidden');
			cubeRootButton.classList.toggle('hidden');
			tenPowerButton.classList.toggle('hidden');
			twoPowerButton.classList.toggle('hidden');

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
	calculateExpression: function () {
		this.expression = [];
		this.postfix = [];
		this.answer = 0;

		try {
			this.expression = tokenizeExpression(input.value);

			this.postfix = buildPostfixExpression(this.expression);

			this.answer = solveExpression(this.postfix);

			this.handleHistory();

			input.value = this.answer;

			errorDisplay.textContent = '';
		} catch (error) {
			errorDisplay.textContent = error.message;
		}
	},
	handleHistory: function () {
		const expr = this.expression.join('');

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
