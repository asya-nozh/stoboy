'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const store = window.StoboyStore;
  const form = document.getElementById('authForm');
  const loginButton = document.querySelector('.form__control_login');
  const registerButton = document.querySelector('.form__control_register');
  const nameField = document.querySelector('.form__field_name');
  const orText = document.querySelector('.form__or');
  const submitButton = document.querySelector('.form__submit');
  const firstname = form.elements.firstname;
  const phone = form.elements.phone;
  const email = form.elements.email;
  const password = form.elements.password;
  const errors = {
    firstname: document.querySelector('.form__error_firstname'),
    phone: document.querySelector('.form__error_phone'),
    email: document.querySelector('.form__error_email'),
    password: document.querySelector('.form__error_password')
  };
  let registerMode = true;

  const demo = document.createElement('div');
  demo.className = 'auth-demo';
  demo.innerHTML = '<strong>Демо-вход:</strong><br>demo@stoboy.ru<br>пароль: demo123';
  form.after(demo);

  function clearErrors() {
    Object.values(errors).forEach(element => { element.textContent = ''; });
    Array.from(form.elements).forEach(element => element.classList?.remove('invalid'));
  }

  function setMode(isRegister) {
    registerMode = isRegister;
    clearErrors();
    form.reset();
    registerButton.classList.toggle('active', isRegister);
    loginButton.classList.toggle('active', !isRegister);
    nameField.classList.toggle('hidden', !isRegister);
    orText.classList.toggle('active', !isRegister);
    submitButton.textContent = isRegister ? 'зарегистрироваться' : 'войти';
    password.autocomplete = isRegister ? 'new-password' : 'current-password';
    demo.hidden = isRegister;
  }

  loginButton.addEventListener('click', () => setMode(false));
  registerButton.addEventListener('click', () => setMode(true));

  form.addEventListener('submit', event => {
    event.preventDefault();
    clearErrors();
    let invalid = false;
    const nameValue = firstname.value.trim();
    const phoneValue = phone.value.trim();
    const emailValue = email.value.trim().toLowerCase();
    const passwordValue = password.value;
    const phoneDigits = phoneValue.replace(/\D/g, '');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(field, message) {
      errors[field].textContent = message;
      form.elements[field].classList.add('invalid');
      invalid = true;
    }

    if (registerMode && !/^[а-яА-ЯёЁa-zA-Z-]{2,50}$/.test(nameValue)) showError('firstname', 'Введите корректное имя');
    if (registerMode && phoneDigits.length !== 11) showError('phone', 'Введите телефон из 11 цифр');
    if (!registerMode && !phoneValue && !emailValue) {
      showError('phone', 'Введите телефон или почту');
      showError('email', 'Введите телефон или почту');
    }
    if (emailValue && !emailPattern.test(emailValue)) showError('email', 'Неверный формат почты');
    if (registerMode && !emailValue) showError('email', 'Введите почту');
    if (passwordValue.length < 6) showError('password', 'Пароль должен содержать минимум 6 символов');
    if (invalid) return;

    try {
      if (registerMode) {
        const normalizedName = nameValue.charAt(0).toUpperCase() + nameValue.slice(1).toLowerCase();
        store.register({ firstname: normalizedName, phone: phoneValue, email: emailValue, password: passwordValue });
      } else {
        store.login({ phone: phoneValue, email: emailValue, password: passwordValue });
      }
      window.location.href = 'account.html';
    } catch (authError) {
      errors.password.textContent = authError.message;
      password.classList.add('invalid');
    }
  });

  const currentUser = store.getCurrentUser();
  if (currentUser) {
    const notice = document.createElement('p');
    notice.className = 'auth-current-user';
    notice.innerHTML = `Вы уже вошли как ${currentUser.firstname}. <a href="account.html">Перейти в аккаунт</a>`;
    form.before(notice);
  }
  setMode(true);
});
