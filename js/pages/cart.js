// Функция для обновления общей суммы корзины
function updateCartSum() {
    const cartCards = document.querySelectorAll('.cart__card');
    let totalSum = 0;

    cartCards.forEach(card => {
        const price = parseFloat(card.dataset.price) || 0;
        const count = parseInt(card.querySelector('.cart__count').textContent) || 0;
        totalSum += price * count;
    });

    const sumElem = document.querySelector('.cart__sum');
    if (sumElem) {
        sumElem.textContent = `сумма: ${totalSum}р.`;
    }
}

// Основной код с логикой счётчика и удаления
document.querySelectorAll('.cart__card').forEach(card => {
    const decreaseBtn = card.querySelector('.cart__decrease');
    const increaseBtn = card.querySelector('.cart__increase');
    const countSpan = card.querySelector('.cart__count');
    const maxCount = parseInt(card.dataset.count) || 1;
    const removeBtn = card.querySelector('button img[alt="удалить"]')?.parentElement;

    function updateButtons(count) {
        // Ограничиваем максимум
        if (count >= maxCount) {
            increaseBtn.disabled = true;
            increaseBtn.style.opacity = 0.5;
        } else {
            increaseBtn.disabled = false;
            increaseBtn.style.opacity = 1;
        }

        // Если count 0 или меньше — удаляем карточку и обновляем сумму
        if (count <= 0) {
            card.remove();
            updateCartSum();
            return false; // Чтобы прекратить дальнейшие действия
        }
        return true;
    }

    decreaseBtn.addEventListener('click', () => {
        let count = parseInt(countSpan.textContent);
        count--;
        if (!updateButtons(count)) return;
        countSpan.textContent = count;
        updateCartSum();
    });

    increaseBtn.addEventListener('click', () => {
        let count = parseInt(countSpan.textContent);
        if (count < maxCount) {
            count++;
            countSpan.textContent = count;
            updateButtons(count);
            updateCartSum();
        }
    });

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            card.remove();
            updateCartSum();
        });
    }

    // Инициализация кнопок и суммы при загрузке
    updateButtons(parseInt(countSpan.textContent));
});

updateCartSum();




const html = document.documentElement;
const body = document.body;

function openProductModal(card) {
    const modal = document.getElementById('productsModal');

    const title = card.dataset.title;
    const price = card.dataset.price;
    const size = card.dataset.size;
    const description = JSON.parse(card.dataset.description || '[]');
    const images = JSON.parse(card.dataset.images || '[]');
    const maxCount = parseInt(card.dataset.count) || 1;

    // Элементы модалки
    const modalCountSpan = modal.querySelector('.modal__count');
    const modalDecreaseBtn = modal.querySelector('.modal__decrease');
    const modalIncreaseBtn = modal.querySelector('.modal__increase');

    // Элементы карточки
    const cardCounter = card.querySelector('.cart__counter');
    const cardCountSpan = cardCounter ? cardCounter.querySelector('.cart__count') : null;
    const cardDecreaseBtn = cardCounter ? cardCounter.querySelector('.cart__decrease') : null;
    const cardIncreaseBtn = cardCounter ? cardCounter.querySelector('.cart__increase') : null;

    // Текущий счётчик из карточки или 1 по умолчанию
    let currentCount = cardCountSpan ? parseInt(cardCountSpan.textContent) : 1;

    // Заполнение модалки
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalTitleDupl').textContent = title;
    document.getElementById('modalPrice').textContent = price + 'р.';
    document.getElementById('modalSize').textContent = 'Размер: ' + size;

    const descList = document.getElementById('modalDescription');
    descList.innerHTML = '';
    description.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        descList.appendChild(li);
    });

    const imagesContainer = document.getElementById('modalImages');
    imagesContainer.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.classList.add('modal__images-wrapper');

    const mainImage = document.createElement('img');
    mainImage.className = 'modal__main-image';
    mainImage.src = images[0] || '';
    wrapper.appendChild(mainImage);

    const thumbs = document.createElement('div');
    thumbs.classList.add('modal__thumbs');

    images.slice(0, 3).forEach((src, index) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        if (index === 0) thumb.classList.add('active');

        thumb.addEventListener('click', () => {
            mainImage.src = src;
            thumbs.querySelectorAll('img').forEach(img => img.classList.remove('active'));
            thumb.classList.add('active');
        });

        thumbs.appendChild(thumb);
    });

    wrapper.appendChild(thumbs);
    imagesContainer.appendChild(wrapper);

    // Функция обновления кнопок карточки
    function updateCardButtonsState(count, maxCount, cardDecreaseBtn, cardIncreaseBtn) {
        if (cardDecreaseBtn) cardDecreaseBtn.disabled = count <= 1;
        if (cardIncreaseBtn) cardIncreaseBtn.disabled = count >= maxCount;
    }

    // Функция обновления счётчика в модалке и карточке
    function updateCounts(count) {
        currentCount = count;
        modalCountSpan.textContent = count;
        if (cardCountSpan) {
            cardCountSpan.textContent = count;
        }

        // Кнопки модалки
        modalDecreaseBtn.disabled = count <= 0;
        modalIncreaseBtn.disabled = count >= maxCount;

        // Кнопки карточки
        updateCardButtonsState(count, maxCount, cardDecreaseBtn, cardIncreaseBtn);

        // Получаем элементы управления
        const modalControls = modal.querySelector('.modal__controls');
        const addCartBtn = modal.querySelector('.modal__add-cart');

        if (count <= 0) {
            // Удаляем карточку из DOM
            if (card.parentElement) card.remove();

            // Прячем кнопки управления, показываем кнопку добавления
            modalControls.classList.add('hidden');
            addCartBtn.classList.add('active');
        } else {
            // Показываем кнопки, скрываем "добавить"
            modalControls.classList.remove('hidden');
            addCartBtn.classList.remove('active');
        }

        // Обновляем сумму
        updateCartSum();
    }

    updateCounts(currentCount);

    // Обработчики кнопок в модалке
    modalDecreaseBtn.onclick = () => {
        if (currentCount > 0) {
            updateCounts(currentCount - 1);
        }
    };

    modalIncreaseBtn.onclick = () => {
        if (currentCount < maxCount) {
            updateCounts(currentCount + 1);
        }
    };

    // Обработчики кнопок в карточке (чтобы не открывалась модалка при клике)
    if (cardDecreaseBtn) {
        cardDecreaseBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentCount > 1) {
                updateCounts(currentCount - 1);
            }
        };
    }

    if (cardIncreaseBtn) {
        cardIncreaseBtn.onclick = (e) => {
            e.stopPropagation();
            if (currentCount < maxCount) {
                updateCounts(currentCount + 1);
            }
        };
    }

    modal.style.display = 'flex';
    html.classList.add('modal-open');
    body.classList.add('modal-open');

    // Закрытие модалки — обновляем кнопки карточки при закрытии
    const closeModalBtn = modal.querySelector('.modal__close');
    if (closeModalBtn) {
        closeModalBtn.onclick = () => {
            const addCartBtn = modal.querySelector('.modal__add-cart');
            addCartBtn.onclick = () => {
                // Возвращаем карточку в DOM
                if (!document.body.contains(card)) {
                    document.querySelector('.cart__container')?.appendChild(card);
                }

                // Восстанавливаем счётчик
                currentCount = 1;
                updateCounts(currentCount);

                // Показываем контролы, прячем кнопку
                modal.querySelector('.modal__controls').classList.remove('hidden');
                addCartBtn.classList.remove('active');
            };

            modal.style.display = 'none';
            html.classList.remove('modal-open');
            body.classList.remove('modal-open');

            // Обновляем кнопки карточки на выходе
            updateCardButtonsState(currentCount, maxCount, cardDecreaseBtn, cardIncreaseBtn);
        };
    }

    const addToCartBtn = modal.querySelector('.modal__add-cart');
    addToCartBtn.onclick = () => {
        // Показываем контролы, скрываем кнопку
        modal.querySelector('.modal__controls').classList.remove('hidden');
        addToCartBtn.classList.remove('active');

        // Возвращаем карточку обратно (если была удалена)
        let cartContainer = document.querySelector('.cart__cards');
        if (!cartContainer.contains(card)) {
            cartContainer.appendChild(card);
        }

        // Счётчик ставим в 1
        currentCount = 1;
        updateCounts(currentCount);

        // Обновляем сумму
        updateCartSum();
    };

}

// Обработчик клика на карточку
document.querySelectorAll('.cart__card').forEach(card => {
    card.addEventListener('click', (e) => {
        // Проверяем, что клик не по счётчику и не по кнопке удаления
        if (
            !e.target.closest('.cart__counter') &&
            !e.target.closest('button img[alt="удалить"]')
        ) {
            openProductModal(card);
        }
    });
});

// Закрытие модалки по кнопке и по фону
document.querySelector('.modal__close').addEventListener('click', () => {
    const modal = document.getElementById('productsModal');
    modal.style.display = 'none';
    html.classList.remove('modal-open');
    body.classList.remove('modal-open');
});

document.getElementById('productsModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) {
        e.currentTarget.style.display = 'none';
        html.classList.remove('modal-open');
        body.classList.remove('modal-open');
    }
});

// Скрыть модалку изначально
window.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productsModal');
    modal.style.display = 'none';
    html.classList.remove('modal-open');
    body.classList.remove('modal-open');
});

