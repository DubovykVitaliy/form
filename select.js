//  const form = document.querySelector('#form');
//

const selectWrapperEl = document.getElementById('select-skill');
const selectInputEl = selectWrapperEl.querySelector('[data-type="input"]');
const optionListEl = selectWrapperEl.querySelector('[data-type="options"]');
const backdropEl = selectWrapperEl.querySelector('[data-type="backdrop"]');
const optionsEls = Array.from(optionListEl.children);
//  console.log(optionsEls);
let active = -1;
let focusedEl;

function toggleDropDown() {
	optionListEl.classList.toggle('hide');
	backdropEl.classList.toggle('hide');
	active = -1;
}
function removeFocus(list) {
	for (const el of list) {
		el.blur();
	}
}

selectInputEl.addEventListener('click', () => {
	toggleDropDown();
});
//
function handleSelectValue(e) {
	selectInputEl.value = focusedEl.dataset.value;
}

//
document.addEventListener('keydown', function (e) {
	if (e.key == 'ArrowDown' && active < optionsEls.length - 1) {
		active++;
		focusedEl = optionsEls[active];
		focusedEl.focus();
	}
	if (e.key == 'ArrowUp' && active > 0) {
		active--;
		focusedEl = optionsEls[active];
		focusedEl.focus();
	}
	if (e.key == 'Enter') {
		selectInputEl.value = e.target.dataset.value;
		removeFocus(optionsEls);
		activateRange(rangeInput);
		toggleDropDown();
	}
	if (e.key == 'Escape') {
		removeFocus(optionsEls);
		toggleDropDown();
	}
});
optionListEl.addEventListener('mouseover', e => {
	focusedEl = e.target;
	optionsEls.forEach(el => {
		el.blur();
	});
	focusedEl.focus();
});
optionListEl.addEventListener('click', e => {
	selectInputEl.value = e.target.dataset.value;
	removeFocus(optionsEls);
	activateRange(rangeInput);
	toggleDropDown();
});
backdropEl && backdropEl.addEventListener('click', toggleDropDown);

//
//       * Range
//
// const form = document.querySelector('#form');

const rangeWrapper = form.querySelector('[data-type="range"]');
const rangeInput = rangeWrapper.querySelector('[data-type="rangeInput"]');
const rangeNumber = rangeWrapper.querySelector('[data-type="rangeNum"]');

function getRangeValue() {
	rangeNumber.textContent = rangeInput.value;
}
getRangeValue();
rangeInput.addEventListener('change', getRangeValue);

//
function activateRange(rangeInput) {
	rangeInput.removeAttribute('disabled');
}
function disableRange(rangeInput) {
	rangeInput.setAttribute('disabled', '');
}
