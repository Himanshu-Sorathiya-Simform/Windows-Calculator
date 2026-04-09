import {
	clearHistory,
	insertHistoryCard,
	putValueFromHistory,
} from './handlers/historyHandler.js';
import { calculator } from './modules/calculator.js';

const keypad = document.querySelector('.calculator__keypad');
const calculatorSidebar = document.querySelector('.calculator__sidebar');
const historyBoard = document.querySelector('.calculator__board');
const toggleHistoryViewButton = document.querySelector('.btn--history');
const historyDeleteButton = document.querySelector('.calculator__delete');
let isHistoryOpen = false;

const history = JSON.parse(localStorage.getItem('history')) || [];

for (const [preview, answer] of history) {
	insertHistoryCard(preview, answer);
}

keypad.addEventListener('click', (e) => calculator.handleClick(e));

document.body.addEventListener('keydown', (e) => calculator.handleKeyboard(e));

historyBoard.addEventListener('click', (e) => putValueFromHistory(e));

historyBoard.addEventListener('keydown', (e) => putValueFromHistory(e));

historyDeleteButton.addEventListener('click', (e) => clearHistory(e));

toggleHistoryViewButton.addEventListener('click', function () {
	isHistoryOpen = !isHistoryOpen;

	if (isHistoryOpen) {
		calculatorSidebar.style.top = 200 + 'px';
	} else {
		calculatorSidebar.style.top = 100 + '%';
	}
});

export { history };
