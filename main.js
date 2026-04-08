import {
	calculateBinary,
	calculateUnary,
	insertHistoryCard,
	isClosingBracket,
	isClosingCeil,
	isOpeningBracket,
	isOpeningCeil,
	isOperand,
	isSimpleOperator,
	isSpecialChar,
	isSpecialOperator,
} from './helpers.js';
import { keyMap, operatorMap, specialValue } from './keyMappings.js';

const keypad = document.querySelector('.calculator__keypad');
const input = document.querySelector('.calculator__input');
const errorDisplay = document.querySelector('.calculator__error');
const calculatorSidebar = document.querySelector('.calculator__sidebar');
const historyBoard = document.querySelector('.calculator__board');
const historyButton = document.querySelector('.btn--history');
const deleteButton = document.querySelector('.calculator__delete');
let isHistoryOpen = false;

// Get history from local storage
const history = JSON.parse(localStorage.getItem('history')) || [];

// Generate history cards based on history coming from local storage
for (const [preview, answer] of history) {
	insertHistoryCard(preview, answer);
}

// If its click event, return expression
// If its keyboard event, only run when its Enter key and return expression
// Stopped propagation because due to bubbling of event, when pressed "Enter" on card, it return the expression, and then due to bubbling and parent also listening, it directly runs "calculate expression" function directly showing answer
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

// Remove from local storage
// Empty existing history board because as localstorage is not reflective, have to do it manually for current session
// Empty existing history array
function clearHistory(e) {
	localStorage.clear();

	historyBoard.innerHTML = '';

	while (history.length) history.pop();
}

const calculator = {
	expression: [],
	operands: [],
	holdingStack: [],
	solution: [],
	numString: '',
	isCeilOpen: false,
	answer: 0,
	brackets: 0,
	ceilBrackets: 0,

	// Handle click happened on UI keyboard
	handleClick: function (e) {
		// Fin nearest key element and get its key
		const key = e.target.closest('.calculator__key')?.getAttribute('data-key');

		// If its not key, return
		if (!key) return;

		// If "C" clicked, call clear display
		if (key === 'clear') {
			this.clearDisplay();
			return;
		}

		// If "backspace" clicked, call handle backspace
		if (key === 'backspace') {
			this.handleBackspace();
			return;
		}

		// If "=" clicked, call calculate expression
		if (key === 'equals') {
			this.calculateExpression();
			return;
		}

		// If "ceiling" clicked, check if there exist an opening ceil or not and based on that add appropriate ceil bracket
		if (key === 'ceiling' && this.isCeilOpen) {
			this.isCeilOpen = false;
			input.value = input.value + keyMap.get(key).displayClose;
			return;
		} else if (key === 'ceiling' && !this.isCeilOpen) {
			this.isCeilOpen = true;
		}

		// if its any other btn, get its "display" value from map and make sure focus again comes back to input, not on button
		input.value = input.value + keyMap.get(key).display;
		input.focus();
	},
	// Handle keyboard keypress
	handleKeyboard: function (e) {
		// Give focus only when its not "Tab"
		if (e.key !== 'Tab') input.focus();

		// If its "Escape" key pressed, clear the display
		if (e.key === 'Escape') {
			e.preventDefault();

			this.clearDisplay();
			return;
		}
		// If its "Enter" or "=" key pressed, call calculate expression
		if (e.key === 'Enter' || e.key === '=') {
			e.preventDefault();

			this.calculateExpression();
			return;
		}
		// User can type anything, even not existing things like "abc ...", Im not filtering as i wants DOM to handle cursor position so that user can type in between. If i handle key presses then all keys will come to end of expression irrespective of cursor position on input element
		// So its better to let DOM handle default input behavior and rely on user to type "valid", if any "invalid" thing is pressed, it will be handled when "tokenization" starts.
	},
	// Tokenization of expression
	tokenizeExpression: function () {
		// Always start with fresh stats
		this.expression = [];
		this.operands = [];
		this.holdingStack = [];
		this.solution = [];
		this.numString = '';
		this.isCeilOpen = false;
		this.brackets = 0;
		this.ceilBrackets = 0;

		const value = input.value;

		// Start looping over input value
		for (let i = 0; i < input.value.length; i++) {
			// Check if its number or ".", add to numString (for giving support to multiple numbers and with dot), and when encounter any kind of operator first add this number into expression then add operator
			if (isOperand(value[i]) || value[i] === '.') {
				this.numString += value[i];
			}
			// Check for opening brackets [ eg: "(" "⌈" ]
			else if (isOpeningBracket(value[i]) || isOpeningCeil(value[i])) {
				// If opening round bracket, increase counter of brackets
				if (isOpeningBracket(value[i])) this.brackets++;
				// If opening ceil bracket, increase counter of ceil brackets
				// (Useful for checking invalid parentheses)
				if (isOpeningCeil(value[i])) this.ceilBrackets++;

				// If after any number, any opening bracket inserted [ eg: "5(" ], then  first add number and automatically add "*" in between making "4*("
				if (this.numString) {
					this.expression.push(this.numString, '*');
					this.numString = '';
				}

				this.expression.push(value[i]);
			}
			// Check for any "single character operator" [ eg: + - ! ... ] or any closing bracket [ eg: ")" "⌉" ]
			else if (
				isSimpleOperator(value[i]) ||
				isClosingBracket(value[i]) ||
				isClosingCeil(value[i])
			) {
				// If closing bracket, decrease counter of brackets
				if (isClosingBracket(value[i])) this.brackets--;
				// If closing bracket, decrease counter of brackets
				// (Useful for checking invalid parentheses)
				if (isClosingCeil(value[i])) this.ceilBrackets--;

				// If after any number, any operator [ eg: "... 5+" ] or closing bracket inserted [ eg: "... 5)" ], add number to expression
				if (this.numString) {
					this.expression.push(this.numString);
					this.numString = '';
				}

				this.expression.push(value[i]);
			}
			// Check for "3 character long operator [ eg: "log" ]"
			else if (isSpecialOperator(value.slice(i, i + 3))) {
				// If after any number, "3 character long operator" inserted [ eg: "5log" ], then first add number and automatically add "*" in between making "5*log"
				if (this.numString) {
					this.expression.push(this.numString, '*');
					this.numString = '';
				}

				this.expression.push(value.slice(i, i + 3));

				// increment i by 2 for skipping next 2 elements as they are already handled
				i += 2;
			}
			// Check for "2 character long operator [ eg: "ln" ]"
			else if (isSpecialOperator(value.slice(i, i + 2))) {
				// If after any number, "2 character long operator" inserted [ eg: "5ln" ], then first add number and automatically add "*" in between making "5*ln"
				if (this.numString) {
					this.expression.push(this.numString, '*');
					this.numString = '';
				}

				this.expression.push(value.slice(i, i + 2));

				// increment i by 1 for skipping next 1 element as its already handled
				i += 1;
			}
			// Check for "π" or "e"
			else if (isSpecialChar(value[i])) {
				// If after any number, any opening bracket inserted [ eg: "5(" ], then first add number and automatically add "*" in between making "5*("
				// If after entering special character, previous is number [ eg: "...2π" ], then first add number and automatically add "*" in between making "2*π"
				if (this.numString) {
					this.expression.push(this.numString, '*');
					this.numString = '';
				}
				// If after entering special character, previous is also special char [ eg: "...ππ" ], then first add previous special char and automatically add "*" in between making "π*π"
				else if (isSpecialChar(this.expression.at(-1))) {
					this.expression.push('*');
				}

				this.expression.push(value[i]);
			}
			// At this point, if anything not handled by previous conditions then charter is not supported by Calc so generate error
			else {
				throw new Error('Invalid Expression');
			}
		}

		// After looping through all values, as entering numbers only when any kind of operator is found, so for last element, there are chances that after that theres no operator to add it into expression [ eg: "... + 5"], so adding it into expression
		if (this.numString) {
			this.expression.push(this.numString);
			this.numString == '';
		}
	},
	// Calculation of expression
	calculateExpression: function () {
		try {
			// First tokenize the expression
			this.tokenizeExpression();

			// If theres no expression, give error
			if (!this.expression.length) throw new Error('Please Enter a Expression');

			// If after tokenization, any kind of opening or closing bracket is remaining then its an error
			if (this.brackets || this.ceilBrackets)
				throw new Error('Please Enter valid Expression');

			// Loop through expression array and build operands and holding stacks
			for (let char of this.expression) {
				// If character is "π" or "e", extract its real value and then continue
				if (isSpecialChar(char)) char = specialValue[char];

				// If number, directly add to operands array
				if (isOperand(char)) this.operands.push(char);
				// If any opening bracket, also directly add to holding stack
				else if (isOpeningBracket(char) || isOpeningCeil(char))
					this.holdingStack.push(char);
				// If its round closing bracket, pop from holding stack and push to operands till opening bracket is found, and at end also pop "(" opening bracket
				else if (isClosingBracket(char)) {
					while (
						this.holdingStack.length &&
						!isOpeningBracket(this.holdingStack.at(-1))
					) {
						this.operands.push(this.holdingStack.pop());
					}

					this.holdingStack.pop();
				}
				// If its ceil closing bracket, pop from holding stack and push to operands till opening ceil bracket is found, and at end also push "⌈" opening ceil bracket to operand as its actual operator
				else if (isClosingCeil(char)) {
					while (
						this.holdingStack.length &&
						!isOpeningCeil(this.holdingStack.at(-1))
					) {
						this.operands.push(this.holdingStack.pop());
					}

					this.operands.push(this.holdingStack.pop());
				}
				// If its an "single character operator" then pop from holding stack and push to operands till first high precedence operator is found
				else if (isSimpleOperator(char)) {
					while (
						this.holdingStack.length &&
						operatorMap[char].precedence <=
							operatorMap[this.holdingStack.at(-1)]?.precedence
					) {
						this.operands.push(this.holdingStack.pop());
					}

					this.holdingStack.push(char);
				}
				// If its special operator [ eg: "log" "ln" ], directly add to holding stack
				else if (isSpecialOperator(char)) {
					this.holdingStack.push(char);
				}
			}

			// At end, if holding stack is still not empty, pop till end and push to operands
			while (this.holdingStack.length !== 0) {
				this.operands.push(this.holdingStack.pop());
			}

			// At this point, operands holds postfix notation of our expression, now actual calculation starts (it will happen on solutions array)
			for (const char of this.operands) {
				// Take character and push to solutions
				this.solution.push(char);

				// If its "single character operator" and requires 2 operands [ eg: "+" "*" "%" ... ]
				if (isSimpleOperator(char) && operatorMap[char].operands === 2) {
					// [ eg: ORIGINAL "5 - 2"]
					// [ eg: POSTFIX "5 2 -"]
					// Latest entry will be operator itself
					const operator = this.solution.pop();
					// Now latest entry will be 2nd operand
					const operand2 = +this.solution.pop();
					// Now latest entry will be 1st operand
					const operand1 = +this.solution.pop();
					// Order matters as ["5 - 2"] is not same as ["2 - 5"]

					// call calculate binary function who returns answer of calculating "operand1 operator operand2"
					// it may return number or string, but always convert it to string for always holding accurate answer, and then push to solution
					this.solution.push(
						String(calculateBinary(operator, operand1, operand2)),
					);
				}
				// If its "single character operator" or "special operator" and requires 1 operands [ eg: "!" "√" "log" ... ]
				else if (
					(isSimpleOperator(char) || isSpecialOperator(char)) &&
					operatorMap[char].operands === 1
				) {
					// [ eg: ORIGINAL "log5" "√25" ]
					// [ eg: POSTFIX "5 log" "25 √"]
					// Latest entry will be operator itself
					const operator = this.solution.pop();
					// Now latest entry will be 1st operand
					const operand = +this.solution.pop();

					// call calculate unary function who returns answer of calculating "operator operand"
					// it may return number or string, but always convert it to string for always holding accurate answer, and then push to solution
					this.solution.push(String(calculateUnary(operator, operand)));
				}
			}

			// At the end, solution will always have only 1 value left and its answer
			this.answer = this.solution.pop();

			// At any point, if it became any of these, its an error, throw it
			if (['undefined', 'null', 'NaN', undefined, null, NaN].includes(this.answer))
				throw new Error('Please Enter valid Expression');

			// Else its success, call handleHistory function to update history
			this.handleHistory();

			// Update value of input, so it shows answer on display
			input.value = this.answer;

			// Remove any previous errors from error display if they existed
			errorDisplay.textContent = '';
		} catch (error) {
			// On any error, show it on error display
			errorDisplay.textContent = error.message;
		} finally {
			// After success or error, reset everything
			this.expression = [];
			this.operands = [];
			this.holdingStack = [];
			this.solution = [];
			this.numString = '';
			this.isCeilOpen = false;
			this.brackets = 0;
			this.ceilBrackets = 0;
		}
	},
	// Handling of history
	handleHistory: function () {
		// Temporarily push it to local history array (with next refresh or visit, history will hold actual history coming from local storage)
		history.push([this.expression.join(''), this.answer]);

		// Create history card
		insertHistoryCard(this.expression.join(''), this.answer);

		// Also set it on local storage for persistence pf history
		localStorage.setItem('history', JSON.stringify(history));
	},
	// Clear display when "C" is clicked
	clearDisplay: function () {
		input.value = '';
	},
	// Remove last character when backspace is clicked from UI keyboard
	handleBackspace: function () {
		input.value = input.value.slice(0, -1);
	},
};

// Event delegation based click event listening on parent
keypad.addEventListener('click', (e) => calculator.handleClick(e));

// Listen to keydown on whole document, not only on any certain element has focus
document.body.addEventListener('keydown', (e) => calculator.handleKeyboard(e));

// Used event delegation on listening to click events on history cards and put expression to input
historyBoard.addEventListener('click', (e) => putValueFromHistory(e));
// Used event delegation on listening to keydown events on history cards and put expression to input
historyBoard.addEventListener('keydown', (e) => putValueFromHistory(e));

deleteButton.addEventListener('click', (e) => clearHistory(e));

// History button hide/show based on click (only for small screens)
historyButton.addEventListener('click', function () {
	isHistoryOpen = !isHistoryOpen;

	if (isHistoryOpen) {
		calculatorSidebar.style.top = 200 + 'px';
	} else {
		calculatorSidebar.style.top = 100 + '%';
	}
});
