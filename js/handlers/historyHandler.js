import { history } from '../main.js';

const calculatorBoard = document.querySelector('.calculator__board');
const historyBoard = document.querySelector('.calculator__board');
const input = document.querySelector('.calculator__input');

const prefix = ['|', '⌈', '⌊', '['];

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
	function removePrefixAndSuffix(expr) {
		return prefix.includes(expr[0]) ? expr.slice(1, -1) : expr;
	}

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
