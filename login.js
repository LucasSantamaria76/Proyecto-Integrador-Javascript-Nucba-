const email = document.getElementById('email');
const password = document.getElementById('password');
const errorEmail = document.getElementById('error-email');
const errorPassword = document.getElementById('error-password');
const loginOrSignup = document.getElementById('loginOrSignup');
const btn = document.getElementById('btn');
const form = document.querySelector('form');
const cardTitle = document.querySelector('.card-title');

const users = JSON.parse(localStorage.getItem('users')) || [];
let user;
let isLogin = true;

const validationEmail = () => /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/.test(email.value);
const validationPassword = () => /(?=.{6,})/.test(password.value);

email.addEventListener('focus', () => (errorEmail.textContent = ''));
password.addEventListener('focus', () => (errorPassword.textContent = ''));

loginOrSignup.addEventListener('click', () => {
  if (isLogin) {
    cardTitle.textContent = 'Formulario de registro';
    loginOrSignup.textContent = '¿Ya tienes cuenta? Inicia sesión aquí...';
    btn.textContent = 'Registrarse';
  } else {
    cardTitle.textContent = 'Formulario de login';
    loginOrSignup.textContent = '¿No tienes cuenta? registrate aquí...';
    btn.textContent = 'Iniciar sesión';
  }
  isLogin = !isLogin;
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  !validationEmail() && (errorEmail.textContent = 'E-mail no válido');
  !validationPassword() && (errorPassword.textContent = 'La cadena debe tener 6 caracteres o más.');
  if (!validationPassword() || !validationEmail()) return;

  if (isLogin) {
    user = users.find((user) => user.email === email.value && user.password === password.value);
    if (user) {
      localStorage.setItem('currentUser', user.email);
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 500);
    } else
      Swal.fire({
        title: 'Error!',
        text: 'E-mail o contraseña incorrecto',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
  } else {
    user = users.find((user) => user.email === email.value);
    if (!user) {
      user = { email: email.value, password: password.value, cart: [] };
      users.push(user);
      localStorage.setItem('users', JSON.stringify(users));
      localStorage.setItem('currentUser', user.email);
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 500);
    } else
      Swal.fire({
        title: 'Error!',
        text: 'Ese e-mail ya se encuentra registrado',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
  }
});
