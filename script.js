'use strict';

const form = document.querySelector('#form');

const formRules = {
	firstname: {
		type: 'text',
		rules: { min: 1, max: 25 },
		message: {
			missing: 'Please, enter your First Name.',
			size: 'Name should be between 1 and 25 characters.',
		},
	},
	lastname: {
		type: 'text',
		rules: { min: 1, max: 25 },
		message: {
			missing: 'Please, enter your Last Name.',
			size: 'Name should be between 1 and 25 characters.',
		},
	},
	email: {
		type: 'email',
		rules: {
			re: "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
		},
		message: { valid: 'Please, enter valid E-mail.' },
	},
	telephone: {
		type: 'tel',
		rules: { re: '[0-9]' },
		message: { valid: 'Phone number should contain 10 digits.' },
	},
	formImage: {
		type: 'file',
		rules: { ext: ['jpg', 'jpeg', 'png', 'gif'], size: 2 * 1024 * 1024 },
		message: {
			missing: 'Please, Upload Image.',
			ext: 'Only images allowed',
			size: 'Size of your image should be less than 2 MiB',
		},
	},
	agreement: {
		type: 'checkbox',
		rules: { checked: true },
		message: { check: 'Sorry, but you should agree with terms' },
	},
	selectSkill: {
		type: 'text',
		rules: { check: true },
		message: { missing: 'Choose your skill' },
	},
};
const sendForm(){
	
}

const submitForm = function (form, formRules, sendForm) {
	const selectOptions = form.querySelector('.select__options');
	const preview = form.querySelector('.file__preview');
	const defaultMessage = 'This field should be filled!';
	function noop() {};

	const isChecked = (check, checked) => check === checked;
	const isRequired = value => (value === '' ? false : true);
	const isBetween = (value, min, max) =>
		value.length > min && value.length <= max ? true : false;
	const isMatch = (val, re) => val.match(re);
	const isMatchTel = (val, re) =>
		val
			.split('')
			.filter(d => d.match(re))
			.join('').length === 10;

	const allowedExt = (file, ext) => {
		const name = file.name.split('.').pop();
		for (const i of ext) {
			if (i === name) return true;
		}
	};
	const allowedSize = (file, size) => {
		return file.size <= size;
	};

	//*Validate and handle Files
	const cleanFiles = function (file) {
		preview.innerHTML = '';
	};
	const handleFiles = function (file) {
		preview.innerHTML = '';

		const reader = new FileReader();

		reader.onload = pe => {
			const src = pe.target.result;
			preview.insertAdjacentHTML(
				'afterbegin',
				`
					<img src="${src}" alt="${pe.target.name}">
			`
			);
		};
		reader.readAsDataURL(file);
	};

	//* initialize required inputs

	const reqInputs = [];
	function checkRequired(formRules) {
		const inputs = form.querySelectorAll('input');
		for (const name in formRules) {
			inputs.forEach(i => {
				i.name === name && reqInputs.push(i);
			});
		}
	}

	function indicateRequiredInputs(inputs) {
		inputs.forEach(i => {
			i.closest('.form__item').classList.add('req');
		});
	}
	checkRequired(formRules);
	indicateRequiredInputs(reqInputs);
	//
	//* handle error message

	function renderError(wrapper, message) {
		const error = document.createElement('div');
		error.classList.add('form__error');
		error.textContent = message;
		wrapper.insertAdjacentElement('beforeend', error);
	}

	const showError = (input, message) => {
		const wrapper = input.closest('.form__item');
		wrapper.classList.remove('success');
		wrapper.classList.add('error');
		const err = wrapper.querySelector('.form__error');
		const mes = message ? message : defaultMessage;
		err ? (err.textContent = mes) : renderError(wrapper, mes);
	};
	const showSuccess = input => {
		const wrapper = input.closest('.form__item');
		wrapper.classList.remove('error');
		wrapper.classList.add('success');
		const err = wrapper.querySelector('.form__error');
		err && err.remove();
	};

	// * validate each input
	function isValid(e) {
		//* that decision allowed receive targeting input from 'submit' event and from each input 'change' event
		let input;
		if (e.target) {
			input = e.target;
			// * adding select input, maybe should find another decision
			if (e.target.closest('.select__options')) {
				input = e.target
					.closest('.form__item')
					.querySelector('[name="selectSkill"]');
			}
		} else {
			input = e;
		}
		const rule = formRules[input.name];

		if (rule.type === 'text') {
			const { min, max } = rule.rules;
			const val = input.value.trim();

			if (!isRequired(val)) {
				showError(input, rule.message?.missing);
			} else if (min && max && !isBetween(val, min, max)) {
				showError(input, rule.message?.size);
			} else {
				showSuccess(input);
				return true;
			}
		}
		if (rule.type === 'email') {
			let re = null;
			if (rule.rules?.re) re = new RegExp(rule.rules.re);
			const val = input.value.trim().toLowerCase();

			if (re && !isMatch(val, re)) {
				showError(input, rule.message?.valid);
			} else {
				showSuccess(input);
				return true;
			}
		}
		if (rule.type === 'tel') {
			let re = null;
			if (rule.rules?.re) re = new RegExp(rule.rules.re);
			const val = input.value.trim();

			if (re && !isMatchTel(val, re)) {
				showError(input, rule.message?.valid);
			} else {
				showSuccess(input);
				return true;
			}
		}
		if (rule.type === 'file') {
			const ext = rule.rules?.ext;
			const size = rule.rules?.size;
			const file = input.files[0];

			if (!file) {
				cleanFiles(file);
				showError(input, rule.message?.missing);
			} else if (ext && !allowedExt(file, ext)) {
				cleanFiles(file);
				showError(input, rule.message?.ext);
			} else if (size && !allowedSize(file, size)) {
				cleanFiles(file);
				showError(input, rule.message?.size);
			} else {
				showSuccess(input);
				handleFiles(file);
				return true;
			}
		}
		if (rule.type === 'checkbox') {
			const { checked } = rule.rules;
			const check = input.checked;
			if (!isChecked(check, checked)) {
				showError(input, rule.message?.check);
			} else {
				showSuccess(input);
				return true;
			}
		}
	}
	function handleSubmit(e) {
		e.preventDefault();
		let error = 0;
		let fileInput;
		reqInputs.forEach(i => {
			if (i.type === 'file') fileInput = i;
			if (!isValid(i)) error++;
		});
		const formData = new FormData(form);
		formData.append(fileInput.name, fileInput.files[0]);
		// console.log(formData);
		!error ? sendForm(formData) : noop();
	}

	//* Adding Listeners

	reqInputs.forEach(i => {
		i.addEventListener('change', isValid);
	});
	selectOptions.addEventListener('click', isValid);

	form.addEventListener('submit', handleSubmit);
};

submitForm(form, formRules);
