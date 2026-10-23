document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("authForm");

    const loginBtn = document.querySelector('.form__control_login');
    const registerBtn = document.querySelector('.form__control_register');
    const nameField = document.querySelector('.form__field_name');
    const orText = document.querySelector('.form__or');
    const submitBtn = document.querySelector('.form__submit');

    const firstnameInput = form.querySelector('input[name="firstname"]');
    const phoneInput = form.querySelector('input[name="phone"]');
    const emailInput = form.querySelector('input[name="email"]');
    const passwordInput = form.querySelector('input[name="password"]');

    const firstnameError = form.querySelector(".form__error_firstname");
    const phoneError = form.querySelector(".form__error_phone");
    const emailError = form.querySelector(".form__error_email");
    const passwordError = form.querySelector(".form__error_password");

    // Статус: true — регистрация, false — вход
    let isRegister = true;

    function toggleFormMode(registerMode) {
        isRegister = registerMode;

        // Сброс ошибок и выделений
        [firstnameError, phoneError, emailError, passwordError].forEach(el => el.textContent = "");
        [firstnameInput, phoneInput, emailInput, passwordInput].forEach(input => input.classList.remove("invalid"));

        // (по желанию) очистка всех полей:
        form.reset();

        if (isRegister) {
            registerBtn.classList.add('active');
            loginBtn.classList.remove('active');
            nameField.classList.remove('hidden');
            orText.classList.remove('active');
            submitBtn.textContent = 'зарегистрироваться';
            passwordInput.setAttribute('autocomplete', 'new-password');
        } else {
            loginBtn.classList.add('active');
            registerBtn.classList.remove('active');
            nameField.classList.add('hidden');
            orText.classList.add('active');
            submitBtn.textContent = 'войти';
            passwordInput.setAttribute('autocomplete', 'current-password');
        }
    }


    loginBtn.addEventListener('click', e => {
        e.preventDefault();
        toggleFormMode(false);
    });

    registerBtn.addEventListener('click', e => {
        e.preventDefault();
        toggleFormMode(true);
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Сброс ошибок и стилей
        [firstnameError, phoneError, emailError, passwordError].forEach(el => el.textContent = "");
        [firstnameInput, phoneInput, emailInput, passwordInput].forEach(input => input.classList.remove("invalid"));

        let hasError = false;
        const validateName = (value) => /^[а-яА-ЯёЁa-zA-Z-]{2,50}$/.test(value.trim());
        const capitalize = (str) => str.trim().charAt(0).toUpperCase() + str.trim().slice(1).toLowerCase();

        if (isRegister) {
            // Регистрация — проверяем имя
            let firstname = firstnameInput.value;
            if (firstname.trim() === "") {
                firstnameError.textContent = "❗ введите имя";
                firstnameInput.classList.add("invalid");
                hasError = true;
            } else if (!validateName(firstname)) {
                firstnameError.textContent = "❗ введите корректное имя";
                firstnameInput.classList.add("invalid");
                hasError = true;
            } else {
                firstname = capitalize(firstname);
                firstnameInput.value = firstname;
            }
        }

        // --- Только при входе: одно из полей обязательно (телефон или почта)
        if (!isRegister) {
            const phoneEmpty = phoneInput.value.trim() === "";
            const emailEmpty = emailInput.value.trim() === "";

            if (phoneEmpty && emailEmpty) {
                phoneError.textContent = "📞 введите телефон или почту";
                phoneInput.classList.add("invalid");
                emailError.textContent = "💌 введите телефон или почту";
                emailInput.classList.add("invalid");
                hasError = true;
            }
        }

        // --- Телефон
        const phoneValue = phoneInput.value.trim();
        const phonePattern = /^[\d\s()+-]+$/;
        const digitCount = (phoneValue.match(/\d/g) || []).length;

        if (isRegister || phoneValue !== "") {
            if (phoneValue === "") {
                if (isRegister) {
                    phoneError.textContent = "📞 введите телефон";
                    phoneInput.classList.add("invalid");
                    hasError = true;
                }
            } else if (!phonePattern.test(phoneValue)) {
                phoneError.textContent = "📞 недопустимые символы";
                phoneInput.classList.add("invalid");
                hasError = true;
            } else if (digitCount !== 11) {
                phoneError.textContent = "📞 некорректная длина номера";
                phoneInput.classList.add("invalid");
                hasError = true;
            }
        }

        // --- Email
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (isRegister || emailValue !== "") {
            if (emailValue === "") {
                if (isRegister) {
                    emailError.textContent = "💌 введите почту";
                    emailInput.classList.add("invalid");
                    hasError = true;
                }
            } else if (!emailPattern.test(emailValue)) {
                emailError.textContent = "💌 неверный формат";
                emailInput.classList.add("invalid");
                hasError = true;
            }
        }



        // Пароль — общий, минимальная длина 6
        const passwordValue = passwordInput.value;
        if (passwordValue === "") {
            passwordError.textContent = "🔒 введите пароль";
            passwordInput.classList.add("invalid");
            hasError = true;
        } else if (passwordValue.length < 6) {
            passwordError.textContent = "🔒 минимум 6 символов";
            passwordInput.classList.add("invalid");
            hasError = true;
        }

        if (!hasError) {
            if (isRegister) {
                alert("✅ Вы зарегистрировались");
            } else {
                alert("✅ Вы вошли в систему");
            }
            form.reset();
            toggleFormMode(isRegister); // сбросить к текущему виду, чтобы имя опять появилось/спряталось
        }
    });

    // Инициализация формы на регистрацию
    toggleFormMode(true);
});
