const calculatorBoard = document.querySelector('.calculator__board');
const historyBoard = document.querySelector('.calculator__board');
const input = document.querySelector('.calculator__input');

function insertHistoryCard(preview, answer) {
	const historyCard = `
            <button class="history__card">
                <p class="history__preview">${preview}</p>

                <p class="history__answer">${answer}</p>
            </button>
        `;

	calculatorBoard.insertAdjacentHTML('afterbegin', historyCard);
}

function putValueFromHistory(e) {
	if (e instanceof KeyboardEvent && e.key !== 'Enter') {
		return;
	}

	e.stopPropagation();

	const value = e.target
		.closest('.history__card')
		.querySelector('.history__preview').textContent;

	input.value = value;
}

function clearHistory(e) {
	localStorage.clear();

	historyBoard.innerHTML = '';
}

export { clearHistory, insertHistoryCard, putValueFromHistory };
