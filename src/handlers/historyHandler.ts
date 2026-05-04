import { history } from '../main.js';

const historyBoard = document.querySelector<HTMLDivElement>('.calculator__board')!;
const input = document.querySelector<HTMLInputElement>('.calculator__input')!;

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

function removePrefixAndSuffix(expr: string): string {
	if (!expr) return expr;

	const match = prefixes.find((p) => expr.startsWith(p));

	if (match) {
		return expr.slice(match.length, -1);
	}

	return expr;
}

function insertHistoryCard(previewStr: string, answerStr: string) {
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

	historyBoard.prepend(historyCard);
}

function putValueFromHistory(e: KeyboardEvent | MouseEvent) {
	if (e instanceof KeyboardEvent && e.key !== 'Enter') {
		return;
	}

	e.stopPropagation();

	const expr = (e.target as HTMLElement)
		?.closest('.history__card')
		?.querySelector('.history__preview')?.textContent;

	if (!expr) return;

	const value = removePrefixAndSuffix(expr);

	input.value = value;
}

function clearHistory(e: MouseEvent) {
	localStorage.clear();

	historyBoard.innerHTML = '';

	history.length = 0;
}

export { clearHistory, insertHistoryCard, putValueFromHistory };
