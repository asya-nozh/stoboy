'use strict'
window.addEventListener('load', () => {

    const slides = document.querySelector('.gallery__slides');
    const slide = document.querySelector('.gallery__slide-img');
    const totalSlides = document.querySelectorAll('.gallery__slide').length;
    const slideGap = 20;
    const slideWidth = slide.offsetWidth + slideGap;

    let index = 1;
    let isAnimating = false;
    let userInteracted = false;
    let autoSlideInterval;

    // Устанавливаем начальное положение слайдера
    slides.style.transform = `translateX(${-slideWidth * index}px)`;

    // Функция перелистывания слайдов
    function updateSlidePosition() {
        if (isAnimating) return;
        isAnimating = true;

        slides.style.transition = 'transform 0.7s ease';
        slides.style.transform = `translateX(${-slideWidth * index}px)`;

        slides.addEventListener('transitionend', handleTransitionEnd, { once: true });
    }

    // Обработка переходов на клоны для бесконечного слайдера
    function handleTransitionEnd() {
        if (index === 0) {
            slides.style.transition = 'none';
            index = totalSlides - 2;
            slides.style.transform = `translateX(${-slideWidth * index}px)`;
        }

        if (index === totalSlides - 1) {
            slides.style.transition = 'none';
            index = 1;
            slides.style.transform = `translateX(${-slideWidth * index}px)`;
        }

        updateControls();
        isAnimating = false;
    }

    // Обработка кликов по стрелкам
    document.querySelector('.gallery__arrows_left').addEventListener('click', () => {
        if (!isAnimating) {
            index--;
            updateSlidePosition();
        }
        disableAutoSlideForever();
    });

    document.querySelector('.gallery__arrows_right').addEventListener('click', () => {
        if (!isAnimating) {
            index++;
            updateSlidePosition();
        }
        disableAutoSlideForever();
    });

    const controls = document.querySelectorAll('.gallery__control');

    // Обновление активной контрольной точки
    function updateControls() {
        controls.forEach((control, i) => {
            control.classList.toggle('gallery__control_active', i === index - 1);
        });
    }

    // Обработка кликов по контрольным точкам
    controls.forEach((control, i) => {
        control.addEventListener('click', () => {
            if (!isAnimating) {
                index = i + 1;
                updateSlidePosition();
                updateControls();
            }
            disableAutoSlideForever();
        });
    });

    // Запуск автопрокрутки
    function startAutoSlide() {
        if (userInteracted) return; // Не запускать, если пользователь уже взаимодействовал
        autoSlideInterval = setInterval(() => {
            if (!isAnimating) {
                index++;
                updateSlidePosition();
            }
        }, 6000);
    }

    // Остановка автопрокрутки
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Отключение автопрокрутки навсегда
    function disableAutoSlideForever() {
        stopAutoSlide();
        userInteracted = true;
    }

    startAutoSlide();

    // Остановка/возобновление автопрокрутки при наведении
    const slideshow = document.querySelector('.gallery__slideshow');
    slideshow.addEventListener('mouseenter', stopAutoSlide);
    slideshow.addEventListener('mouseleave', startAutoSlide);

});








const toggles = document.querySelectorAll('.reviews__toggle');

toggles.forEach((btn) => {
    btn.addEventListener('click', () => {
        const reviewText = btn.previousElementSibling;
        reviewText.classList.toggle('expanded');

        btn.innerHTML = reviewText.classList.contains('expanded')
            ? 'скрыть отзыв <span> <</span>'
            : 'прочитать полностью <span> ></span>';
    });
});

document.querySelectorAll('.reviews__photos img').forEach(image => {
    image.addEventListener('click', () => {
        const modal = document.createElement('div');
        modal.classList.add('modal-overlay');

        const img = document.createElement('img');
        img.src = image.getAttribute('src');
        img.alt = image.alt;
        img.classList.add('modal-image');

        modal.appendChild(img);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const accordionItems = document.querySelectorAll(".faq__item");

    accordionItems.forEach((item) => {
        const header = item.querySelector(".faq__header");

        header.addEventListener("click", () => {
            // Если уже открыт — закроем
            const isActive = item.classList.contains("faq__item_active");

            // Закроем все элементы
            accordionItems.forEach((el) => {
                el.classList.remove("faq__item_active");
            });

            // Если не был активен — откроем снова
            if (!isActive) {
                item.classList.add("faq__item_active");
            }
        });
    });
});




document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("questionForm");
    const emailInput = form.querySelector('input[type="email"]');
    const phoneInput = form.querySelector('input[type="tel"]');
    const questionTextarea = form.querySelector("textarea");

    const emailError = form.querySelector(".form__error_email");
    const phoneError = form.querySelector(".form__error_phone");
    const questionError = form.querySelector(".form__error_question");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        let hasError = false;

        // Сброс ошибок
        [emailError, phoneError, questionError].forEach(err => err.textContent = "");
        [emailInput, phoneInput, questionTextarea].forEach(input => input.classList.remove("invalid"));

        const emailValue = emailInput.value.trim();
        const phoneValue = phoneInput.value.trim();
        const questionValue = questionTextarea.value.trim();

        // Проверка вопроса
        if (questionValue === "") {
            questionError.textContent = "❓ напишите свой вопрос ❓";
            questionTextarea.classList.add("invalid");
            hasError = true;
        }

        // Проверка что хотя бы одно из первых двух заполнено
        if (emailValue === "" && phoneValue === "") {
            emailError.textContent = "💌 введите почту или телефон 📞";
            emailInput.classList.add("invalid");
            phoneInput.classList.add("invalid");
            hasError = true;
        }

        // Валидация email (если заполнено)
        if (emailValue !== "") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(emailValue)) {
                emailError.textContent = "💌 неверный формат почты";
                emailInput.classList.add("invalid");
                hasError = true;
            }
        }

        if (phoneValue !== "") {
            const allowedCharsPattern = /^[\d\s()+-]+$/;
            const digitCount = (phoneValue.match(/\d/g) || []).length;

            if (!allowedCharsPattern.test(phoneValue)) {
                phoneError.textContent = "📞 недопустимые символы в телефоне";
                phoneInput.classList.add("invalid");
                hasError = true;
            } else if (digitCount < 11) {
                phoneError.textContent = "📞 номер слишком короткий (нужно 11 цифр)";
                phoneInput.classList.add("invalid");
                hasError = true;
            } else if (digitCount > 11) {
                phoneError.textContent = "📞 номер слишком длинный (макс. 11 цифр)";
                phoneInput.classList.add("invalid");
                hasError = true;
            }
        }

        if (!hasError) {
            alert("Спасибо! Ваш вопрос отправлен 💌 Скоро с вами свяжемся!");
            form.reset();
        }


    });
});








