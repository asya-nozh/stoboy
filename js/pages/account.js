document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.navigation__links button, .navigation__exit, .exit__btn-no');
  const sections = document.querySelectorAll('.account__sections');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Убираем active со всех кнопок
      buttons.forEach(btn => btn.classList.remove('active'));

      // Добавляем active на нажатую кнопку
      button.classList.add('active');

      // Показываем нужный блок
      const target = button.dataset.target;
      sections.forEach(section => {
        if (section.dataset.section === target) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    });
  });
});

document.querySelectorAll('.delivery__track-number').forEach(btn => {
  btn.addEventListener('click', () => {
    const span = btn.querySelector('span');
    if (span) {
      const text = span.textContent;
      navigator.clipboard.writeText(text).then(() => {
        console.log('Скопировано:', text);
      }).catch(err => {
        console.error('Ошибка копирования:', err);
      });
    }
  });
});





document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.delivery__content_center, .order__content_center');

    function updateVisibleCards() {
        const screenWidth = window.innerWidth;
        let visibleCount;

        // Настрой лимиты по ширине
        if (screenWidth >= 1024) {
            visibleCount = 3; // 3 карточки + кнопка = 4
        } else if (screenWidth >= 768) {
            visibleCount = 2;
        } else {
            visibleCount = 1;
        }

        sections.forEach(section => {
            const cards = Array.from(section.querySelectorAll('.delivery__card, .order__card'));
            const moreBtn = section.querySelector('.last');

            // Сброс отображения
            cards.forEach(card => (card.style.display = ''));

            if (cards.length <= visibleCount) {
                if (moreBtn) moreBtn.style.display = 'none';
                return;
            }

            // Спрятать лишние карточки
            cards.forEach((card, index) => {
                if (index >= visibleCount) card.style.display = 'none';
            });

            // Обновить кнопку
            if (moreBtn) {
                const hiddenCount = cards.length - visibleCount;
                moreBtn.textContent = `ещё ${hiddenCount}`;
                moreBtn.style.display = 'inline-block';

                moreBtn.onclick = () => {
                    cards.forEach(card => (card.style.display = ''));
                    moreBtn.style.display = 'none';
                };
            }
        });
    }

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);
});






document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("questionForm");

  const surnameInput = form.querySelector('input[name="surname"]');
  const firstnameInput = form.querySelector('input[name="firstname"]');
  const patronymicInput = form.querySelector('input[name="patronymic"]');
  const phoneInput = form.querySelector('input[name="phone"]');
  const emailInput = form.querySelector('input[name="email"]');
  const submitButton = form.querySelector('.personal__submit');

  const surnameError = form.querySelector(".personal__error_surname");
  const firstnameError = form.querySelector(".personal__error_firstname");
  const patronymicError = form.querySelector(".personal__error_patronymic");
  const phoneError = form.querySelector(".personal__error_phone");
  const emailError = form.querySelector(".personal__error_email");

  // Сохраняем начальные значения
  const initialData = {
    surname: surnameInput.value.trim(),
    firstname: firstnameInput.value.trim(),
    patronymic: patronymicInput.value.trim(),
    phone: phoneInput.value.trim(),
    email: emailInput.value.trim()
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let hasError = false;

    // Сброс ошибок
    [surnameError, firstnameError, patronymicError, phoneError, emailError].forEach(err => err.textContent = "");
    [surnameInput, firstnameInput, patronymicInput, phoneInput, emailInput].forEach(input => input.classList.remove("invalid"));

    const validateName = (value) => {
      const trimmed = value.trim();
      const regex = /^[а-яА-ЯёЁa-zA-Z-]+$/;
      return trimmed.length >= 2 && trimmed.length <= 50 && regex.test(trimmed);
    };

    const capitalize = (str) => {
      const trimmed = str.trim();
      return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
    };

    // Фамилия
    let surname = surnameInput.value;
    if (surname.trim() === "") {
      surnameError.textContent = "❗ введите фамилию";
      surnameInput.classList.add("invalid");
      hasError = true;
    } else if (!validateName(surname)) {
      surnameError.textContent = "❗ введите корректную фамилию";
      surnameInput.classList.add("invalid");
      hasError = true;
    } else {
      surname = capitalize(surname);
      surnameInput.value = surname;
    }

    // Имя
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

    // Отчество
    let patronymic = patronymicInput.value.trim();
    if (patronymic !== "") {
      if (!validateName(patronymic)) {
        patronymicError.textContent = "❗ некорректное отчество";
        patronymicInput.classList.add("invalid");
        hasError = true;
      } else {
        patronymic = capitalize(patronymic);
        patronymicInput.value = patronymic;
      }
    }

    // Телефон
    const phoneValue = phoneInput.value.trim();
    const phonePattern = /^[\d\s()+-]+$/;
    const digitCount = (phoneValue.match(/\d/g) || []).length;

    if (phoneValue === "") {
      phoneError.textContent = "📞 введите телефон";
      phoneInput.classList.add("invalid");
      hasError = true;
    } else if (!phonePattern.test(phoneValue)) {
      phoneError.textContent = "📞 недопустимые символы";
      phoneInput.classList.add("invalid");
      hasError = true;
    } else if (digitCount < 11) {
      phoneError.textContent = "📞 слишком короткий номер";
      phoneInput.classList.add("invalid");
      hasError = true;
    } else if (digitCount > 11) {
      phoneError.textContent = "📞 слишком длинный номер";
      phoneInput.classList.add("invalid");
      hasError = true;
    }

    // Email
    const emailValue = emailInput.value.trim();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailValue === "") {
      emailError.textContent = "💌 введите почту";
      emailInput.classList.add("invalid");
      hasError = true;
    } else if (!emailPattern.test(emailValue)) {
      emailError.textContent = "💌 неверный формат почты";
      emailInput.classList.add("invalid");
      hasError = true;
    }

    // Проверка изменений
    const isChanged =
      initialData.surname !== surnameInput.value.trim() ||
      initialData.firstname !== firstnameInput.value.trim() ||
      initialData.patronymic !== patronymicInput.value.trim() ||
      initialData.phone !== phoneInput.value.trim() ||
      initialData.email !== emailInput.value.trim();

    if (!hasError) {
      if (!isChanged) {
        const originalText = submitButton.textContent;
        submitButton.textContent = "изменений нет";
        submitButton.disabled = true;

        setTimeout(() => {
          submitButton.textContent = originalText;
          submitButton.disabled = false;
        }, 2000);
      } else {
        alert("✅ Данные успешно сохранены!");
        // Обновляем заголовок с именем
        const nameSpan = document.querySelector('.personal__name');
        if (nameSpan) {
          nameSpan.textContent = firstname;
        }
        // Обновляем исходные значения
        initialData.surname = surnameInput.value.trim();
        initialData.firstname = firstnameInput.value.trim();
        initialData.patronymic = patronymicInput.value.trim();
        initialData.phone = phoneInput.value.trim();
        initialData.email = emailInput.value.trim();
      }
    }
  });
});


