import { history } from '../main.js';

const calculatorBoard = document.querySelector('.calculator__board');
const historyBoard = document.querySelector('.calculator__board');
const input = document.querySelector('.calculator__input');

const prefixes = [
	'|',
	'⌈',
	'⌊',
	'[',
	'si(',
	'sin(',
	'cos(',
	'tan(',
	'cot(',
	'sec(',
	'cosec(',
];

function removePrefixAndSuffix(expr) {
	if (!expr) return expr;

	const match = prefixes.find((p) => expr.startsWith(p));

	if (match) {
		return expr.slice(match.length, -1);
	}

	return expr;
}

function insertHistoryCard(previewStr, answerStr) {
	const historyCard = document.createElement('button');
	historyCard.classList.add('history__card');

	const preview = document.createElement('p');
	preview.classList.add('history__preview');
	preview.textContent = previewStr;

	const answer = document.createElement('p');
	answer.classList.add('history__answer');
	answer.textContent = answerStr;

	historyCard.appendChild(preview);
	historyCard.appendChild(answer);

	calculatorBoard.prepend(historyCard);
}

function putValueFromHistory(e) {
	if (e instanceof KeyboardEvent && e.key !== 'Enter') {
		return;
	}

	e.stopPropagation();

	const expr = e.target
		.closest('.history__card')
		.querySelector('.history__preview').textContent;

	const value = removePrefixAndSuffix(expr);

	input.value = value;
}

function clearHistory(e) {
	localStorage.clear();

	historyBoard.innerHTML = '';

	history.length = 0;
}

export { clearHistory, insertHistoryCard, putValueFromHistory };
