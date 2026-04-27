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

const functions = [
	'absolute',
	'ceil',
	'floor',
	'round',
	'sin',
	'cos',
	'tan',
	'cosec',
	'sec',
	'cot',
];

const wrapperOperatorsWithoutClosing = ['reciprocal', 'ten_power', 'two_power'];

const wrapperOperatorsWithClosing = [
	'logarithm',
	'natural_log',
	'square_root',
	'cube_root',
];

const calculator = {
	expression: [],
	postfix: [],
	answer: 0,
	memory: 0,

	getLastNumber: function () {
		const match = input.value.match(/[\d.]+$/);

		return match ? match[0] : '';
	},
	handleMemory: function (e) {
		input.focus();
		const key = e.target.closest('.calculator__memory-btn')?.getAttribute('data-key');

		if (!key) return;

		const mcBtn = document.querySelector('[data-key="clear_memory"]');
		const mrBtn = document.querySelector('[data-key="read_memory"]');

		const toggleMemoryButtons = (isDisabled) => {
			[mcBtn, mrBtn].forEach((el) => {
				el.disabled = isDisabled;
				el.classList.toggle('calculator__memory-btn--disabled', isDisabled);
			});
		};

		if (['memory_add', 'memory_subtract', 'memory_store'].includes(key)) {
			this.calculateExpression(null, false);
		}

		if (key === 'clear_memory') {
			this.memory = 0;

			toggleMemoryButtons(true);
		} else if (key === 'read_memory') {
			input.value += this.memory;
		} else if (key === 'memory_add') {
			this.memory = +(+this.memory + +this.answer);

			toggleMemoryButtons(false);
		} else if (key === 'memory_subtract') {
			this.memory = +(+this.memory - +this.answer);

			toggleMemoryButtons(false);
		} else if (key === 'memory_store') {
			this.memory = +this.answer;

			toggleMemoryButtons(false);
		}
	},
	handleClick: function (e) {
		input.focus();
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

		if (key === 'random') {
			input.value = input.value + Math.random().toFixed(5);

			return;
		}

		if (functions.includes(key)) {
			this.calculateExpression(key);

			return;
		}

		if (
			input.value &&
			wrapperOperatorsWithoutClosing.includes(key) &&
			!operatorMap[input.value.at(-1)]
		) {
			const num = this.getLastNumber();

			input.value =
				input.value.slice(0, -num.length) + keyMap.get(key).display + num;

			return;
		}

		if (
			input.value &&
			wrapperOperatorsWithClosing.includes(key) &&
			!operatorMap[input.value.at(-1)]
		) {
			const num = this.getLastNumber();

			input.value =
				input.value.slice(0, -num.length) +
				keyMap.get(key).display +
				num +
				keyMap.get('right_parenthesis').display;

			return;
		}

		input.value = input.value + keyMap.get(key).display;
	},
	handleKeyboard: function (e) {
		if (e.key !== 'Tab' && e.key !== 'Shift') input.focus();

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

		if (e.key !== 'Tab' && /[a-zA-Z]/.test(e.key) && !isControlKey) {
			e.preventDefault();
		}
	},
	calculateExpression: function (func, updateHistory = true) {
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

			if (updateHistory) this.handleHistory();

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

		history.push([expr, String(this.answer)]);
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
