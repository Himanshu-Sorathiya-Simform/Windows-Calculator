import {
	clearHistory,
	insertHistoryCard,
	putValueFromHistory,
} from './handlers/historyHandler.js';
import { calculator } from './modules/calculator.js';

const keypad = document.querySelector<HTMLDivElement>('.calculator__keypad')!;
const trigonometryFunctions = document.querySelector<HTMLDivElement>(
	'.trigonometry-functions-wrapper',
)!;
const mathFunctions = document.querySelector<HTMLDivElement>('.math-functions-wrapper')!;
const calculatorSidebar = document.querySelector<HTMLDivElement>('.calculator__sidebar')!;
const memoryFunctions = document.querySelector<HTMLDivElement>('.calculator__memory')!;
const historyBoard = document.querySelector<HTMLDivElement>('.calculator__board')!;
const toggleHistoryViewButton = document.querySelector<HTMLDivElement>('.btn--history')!;
const historyDeleteButton =
	document.querySelector<HTMLDivElement>('.calculator__delete')!;

let isHistoryOpen = false;

const history = JSON.parse(localStorage.getItem('history') ?? 'null') || [];

for (const [preview, answer] of history) {
	insertHistoryCard(preview, answer);
}

memoryFunctions.addEventListener('click', (e) => calculator.handleMemory(e));
keypad.addEventListener('click', (e) => calculator.handleClick(e));
mathFunctions.addEventListener('click', (e) => calculator.handleClick(e));
trigonometryFunctions.addEventListener('click', (e) => calculator.handleClick(e));

document.body.addEventListener('keydown', (e) => calculator.handleKeyboard(e));

historyBoard.addEventListener('click', (e) => putValueFromHistory(e));

historyBoard.addEventListener('keydown', (e) => putValueFromHistory(e));

historyDeleteButton.addEventListener('click', (e) => clearHistory(e));

toggleHistoryViewButton.addEventListener('click', function () {
	isHistoryOpen = !isHistoryOpen;

	if (isHistoryOpen) {
		calculatorSidebar.style.top = 10 + 'rem';
	} else {
		calculatorSidebar.style.top = 100 + '%';
	}
});

export { history };
