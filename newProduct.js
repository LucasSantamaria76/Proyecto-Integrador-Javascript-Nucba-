import { formData, notValid } from './modules/validations.js';

const form = document.querySelector('form');
const bugTags = document.querySelectorAll('.text-danger');

const products = JSON.parse(localStorage.getItem('products'));

const validateForm = () =>
  Object.keys(formData).reduce((acc, key) => {
    const obj = notValid(key);
    if (obj) acc = { ...acc, [key]: obj[key] };
    return acc;
  }, {});

form.onsubmit = (e) => {
  e.preventDefault();
  bugTags.forEach((el) => {
    el.textContent = '';
  });
  const errors = validateForm();

  if (Boolean(errors?.length)) {
    bugTags.forEach((el) => {
      if (errors[el.id]) el.textContent = errors[el.id];
    });
  } else {
    console.log(formData);
    products.push(formData);
    localStorage.setItem('products', JSON.stringify(products));
  }
};

form.addEventListener('change', (e) => {
  formData[e.target.name] = e.target.value;
});
