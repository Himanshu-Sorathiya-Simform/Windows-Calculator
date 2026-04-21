import {
	clearHistory,
	insertHistoryCard,
	putValueFromHistory,
} from './handlers/historyHandler.js';
import { calculator } from './modules/calculator.js';

const keypad = document.querySelector('.calculator__keypad');
const mathFunctions = document.querySelector('.math-functions-wrapper');
const calculatorSidebar = document.querySelector('.calculator__sidebar');
const historyBoard = document.querySelector('.calculator__board');
const toggleHistoryViewButton = document.querySelector('.btn--history');
const historyDeleteButton = document.querySelector('.calculator__delete');
const mathFunctionsContainer = document.querySelector(
	'.calculator__dropdown--math-functions',
);
let isHistoryOpen = false;

mathFunctions.style.display = 'none';

const history = JSON.parse(localStorage.getItem('history')) || [];

for (const [preview, answer] of history) {
	insertHistoryCard(preview, answer);
}

keypad.addEventListener('click', (e) => calculator.handleClick(e));
mathFunctions.addEventListener('click', (e) => calculator.handleClick(e));

document.body.addEventListener('keydown', (e) => calculator.handleKeyboard(e));

historyBoard.addEventListener('click', (e) => putValueFromHistory(e));

historyBoard.addEventListener('keydown', (e) => putValueFromHistory(e));

historyDeleteButton.addEventListener('click', (e) => clearHistory(e));

mathFunctionsContainer.addEventListener('click', (e) => {
	console.log(mathFunctionsContainer.style.display);

	mathFunctions.style.display =
		mathFunctions.style.display === 'none' ? 'grid' : 'none';
});

toggleHistoryViewButton.addEventListener('click', function () {
	isHistoryOpen = !isHistoryOpen;

	if (isHistoryOpen) {
		calculatorSidebar.style.top = 10 + 'rem';
	} else {
		calculatorSidebar.style.top = 100 + '%';
	}
});

export { history };
