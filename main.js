import { keyMap } from './keyMappings.js';

const keypad = document.querySelector('.calculator__keypad');
const input = document.querySelector('.calculator__input');

function calculator(e) {
	const key = e.target.closest('.calculator__key').getAttribute('data-key');

	if (key === 'clear') input.value = '';

	if (key === 'backspace') input.value = input.value.slice(0, -1);

	input.value = input.value + keyMap.get(key).display;
}

keypad.addEventListener('click', calculator);
