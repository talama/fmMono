const form = document.getElementById('card-form');
const formCompleted = document.getElementById('form-completed');
const confirmBtn = document.getElementById('confirm-btn');
const continueBtn = document.getElementById('continue-btn');

const displays = document.querySelectorAll('[id|="display"]');
const inputs = document.querySelectorAll('input');
const errors = document.querySelectorAll('[id|="error"]');

const cardName = document.getElementById('card-name');
const errorName = document.getElementById('error-name');
const cardNumber = document.getElementById('card-number');
const errorNumber = document.getElementById('error-number');
const cardMonth = document.getElementById('card-month');
const errorMonth = document.getElementById('error-month');
const cardYear = document.getElementById('card-year');
const errorYear = document.getElementById('error-year');
const cardCvc = document.getElementById('card-cvc');
const errorCvc = document.getElementById('error-cvc');

const errorColor = getComputedStyle(document.body).getPropertyValue('--clr-error');
const borderColor = getComputedStyle(document.body).getPropertyValue(
	'--clr-grey-violet-100'
);

const formFields = {
	name: {
		valid: false,
		default: 'Jane Appleseed',
		error: 'Wrong format, letters only'
	},
	number: {
		valid: false,
		default: '0000 0000 0000 0000',
		error: 'Wrong format, numbers only'
	},
	month: { valid: false, default: '00', error: "Can't be blank" },
	year: { valid: false, default: '00', error: "Can't be blank" },
	cvc: { valid: false, default: '000', error: "Can't be blank" }
};

form.addEventListener('input', (e) => handleInput(e.target));

// Handle submit button
confirmBtn.addEventListener('click', (e) => {
	e.preventDefault();
	if (!validateForm()) {
		return;
	}
	form.classList.add('hidden');
	formCompleted.classList.remove('hidden');
});

// Handle continue button
continueBtn.addEventListener('click', () => {
	// reset inputs
	for (const input of inputs) {
		input.value = '';
	}

	// reset display elements to their default value
	for (const display of displays) {
		const element = display.id.replace('display-', '');
		display.textContent = formFields[element].default;
	}

	// reset errors
	for (const error of errors) {
		error.classList.add('hidden');
	}

	// reset formFields object
	Object.keys(formFields).forEach((key) => {
		formFields[key].valid = false;
	});

	formCompleted.classList.add('hidden');
	form.classList.remove('hidden');
});

// handles user inputs
function handleInput(inputElement) {
	const element = inputElement.id.replace('card-', '');
	const displayElement = document.getElementById(`display-${element}`);
	const errorElement = document.getElementById(`error-${element}`);

	if (!inputElement.value) {
		setValid(false, inputElement, errorElement, "Can't be blank");
		formFields[element].valid = false;
		displayElement.textContent = formFields[element].default;
	} else {
		const [isValid, value] = validateInput(inputElement);
		setValid(isValid, inputElement, errorElement, formFields[element].error);
		formFields[element].valid = isValid;
		displayElement.textContent = inputElement.value || formFields[element].default;
		inputElement.value = value;
	}
}

// validates the input based on its type
// returns a boolean indicating whether the input is valid or not and a formatted input value
function validateInput(inputElement) {
	let [isValid, value] = [false, inputElement.value];
	if (inputElement.id === 'card-name') {
		isValid = /^[a-zA-Z\s]*$/.test(inputElement.value);
	} else if (inputElement.id === 'card-number') {
		value = value.replace(/\s/g, '');
		isValid = /^[0-9]+$/.test(value);
		value = value.match(/(.{1,4})/g).join(' ');
	} else {
		isValid = /^[0-9]+$/.test(value);
		if (!isValid) {
			value = value.substring(0, value.length - 1);
			isValid = value === '' ? false : true;
		}
	}
	return [isValid, value];
}

// changes the styling of an element based on whether isValid is true or false
function setValid(isValid, element, error, msg = '') {
	if (isValid) {
		element.style.outlineColor = borderColor;
		error.classList.add('hidden');
		error.setAttribute('aria-hidden', 'true');
	} else {
		if (msg !== '') {
			error.textContent = msg;
		}
		element.style.outlineColor = errorColor;
		error.classList.remove('hidden');
		error.setAttribute('aria-hidden', 'false');
	}
}

// Validate all form inputs on submit
function validateForm() {
	const date = new Date();
	const currentYear = parseInt(date.getFullYear().toString().slice(2), 10);
	const currentMonth = date.getMonth() + 1;

	const month = parseInt(cardMonth.value);
	const year = parseInt(cardYear.value);

	if (!formFields.name.valid) {
		const errorMsg =
			cardName.value === '' ? 'Cardholder name required' : 'Wrong format, letters only';
		setValid(false, cardName, errorName, errorMsg);
		return false;
	}
	if (!formFields.number.valid || cardNumber.value.length < 19) {
		let errorMsg =
			cardNumber.value === '' ? 'Card Number required' : 'Wrong format, numbers only';
		if (cardNumber.value.length < 19) {
			errorMsg = 'Invalid card number';
		}
		setValid(false, cardNumber, errorNumber, errorMsg);
		return false;
	}
	if (!formFields.year.valid || year < currentYear) {
		const errorMsg = cardYear.value === '' ? "Can't be blank" : 'Invalid year';
		setValid(false, cardYear, errorYear, errorMsg);
		return false;
	}
	if (
		!formFields.month.valid ||
		month > 12 ||
		(year === currentYear && month < currentMonth)
	) {
		const errorMsg = cardMonth.value === '' ? "Cant'be blank" : 'Invalid month';
		setValid(false, cardMonth, errorMonth, errorMsg);
		return false;
	}
	if (!formFields.cvc.valid || cardCvc.value.length < 3) {
		const errorMsg = cardCvc.value === '' ? "Can't be blank" : 'Invalid Cvc';
		setValid(false, cardCvc, errorCvc, errorMsg);
		return false;
	}
	return true;
}
