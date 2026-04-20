const keyMap = new Map([
	['trigonometry_inverse', { display: '' }],
	['clear', { display: '' }],
	['backspace', { display: '' }],

	['pi', { display: 'π' }],
	['euler', { display: 'e' }],

	['square', { display: '^2' }],
	['reciprocal', { display: '1/' }],
	['ten_power', { display: '10^' }],
	['exponent', { display: '*10^' }],

	['root', { display: '√(' }],
	['factorial', { display: '!' }],
	['logarithm', { display: 'log(' }],
	['natural_log', { display: 'ln(' }],

	['power', { display: '^' }],
	['addition', { display: '+' }],
	['subtraction', { display: '-' }],
	['multiplication', { display: '*' }],
	['division', { display: '/' }],
	['remainder', { display: '%' }],

	['left_parenthesis', { display: '(' }],
	['right_parenthesis', { display: ')' }],

	['zero', { display: '0' }],
	['one', { display: '1' }],
	['two', { display: '2' }],
	['three', { display: '3' }],
	['four', { display: '4' }],
	['five', { display: '5' }],
	['six', { display: '6' }],
	['seven', { display: '7' }],
	['eight', { display: '8' }],
	['nine', { display: '9' }],

	['sign_change', { displayPlus: '+', displayMinus: '-' }],

	['decimal', { display: '.' }],

	['equals', { display: '=' }],
]);

const operatorMap = {
	'(': { precedence: 0, operands: 0 },
	')': { precedence: 0, operands: 0 },

	'√': { precedence: 13, operands: 1 },
	'!': { precedence: 14, operands: 1 },
	log: { precedence: 13, operands: 1 },
	ln: { precedence: 13, operands: 1 },
	UM: { precedence: 13, operands: 1 },
	UP: { precedence: 13, operands: 1 },

	'^': { precedence: 13, operands: 2 },
	'+': { precedence: 11, operands: 2 },
	'-': { precedence: 11, operands: 2 },
	'*': { precedence: 12, operands: 2 },
	'/': { precedence: 12, operands: 2 },
	'%': { precedence: 12, operands: 2 },
};

const specialValue = {
	π: `${Math.PI}`,
	e: `${Math.E}`,
};

export { keyMap, operatorMap, specialValue };
