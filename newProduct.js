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
  if (Object.keys(errors).length) {
    bugTags.forEach((el) => {
      if (errors[el.id]) el.textContent = errors[el.id];
    });
  } else if (!products.find((el) => el.id === formData.id)) {
    products.push(formData);
    localStorage.setItem('products', JSON.stringify(products));
    form.reset();
    for (let key in formData) formData[key] = '';
  } else
    Swal.fire({
      text: 'El producto que intentas cargar ya existe',
      icon: 'info',
      confirmButtonText: 'Aceptar',
    });
};

form.addEventListener('change', (e) => {
  formData[e.target.name] = e.target.value;
});
