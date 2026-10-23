document.querySelectorAll('.products__card').forEach(card => {
    const btn = card.querySelector('.products__btn');
    const counter = card.querySelector('.products__counter');
    const decreaseBtn = card.querySelector('.products__decrease');
    const increaseBtn = card.querySelector('.products__increase');
    const countSpan = card.querySelector('.products__count');

    // Берём лимит из data-count, если нет — ставим 5 по умолчанию
    const MAX_COUNT = parseInt(card.getAttribute('data-count')) || 5;

    btn.addEventListener('click', () => {
        btn.classList.add('hidden');
        counter.classList.add('active');
        countSpan.textContent = '1';
        updateIncreaseBtn();
    });

    decreaseBtn.addEventListener('click', () => {
        let count = parseInt(countSpan.textContent, 10);
        if (count > 1) {
            count--;
            countSpan.textContent = count;
            updateIncreaseBtn();
        } else {
            counter.classList.remove('active');
            btn.classList.remove('hidden');
        }
    });

    increaseBtn.addEventListener('click', () => {
        let count = parseInt(countSpan.textContent, 10);
        if (count < MAX_COUNT) {
            count++;
            countSpan.textContent = count;
            updateIncreaseBtn();
        }
    });

    function updateIncreaseBtn() {
        let count = parseInt(countSpan.textContent, 10);
        if (count >= MAX_COUNT) {
            increaseBtn.style.opacity = '0.5';
            increaseBtn.style.pointerEvents = 'none';
        } else {
            increaseBtn.style.opacity = '1';
            increaseBtn.style.pointerEvents = 'auto';
        }
    }
});






const allBtn = document.querySelector('.filtration__all');
const buttons = document.querySelectorAll('.filtration__buttons button');
const sections = document.querySelectorAll('.products__section');

function showSections(activeClasses) {
    // Если activeClasses пустой или содержит 'all' — показываем все
    if (activeClasses.length === 0 || activeClasses.includes('all')) {
        sections.forEach(section => {
            section.style.display = '';
        });
    } else {
        sections.forEach(section => {
            // Проверяем, есть ли у секции класс из активных кнопок
            const show = activeClasses.some(cls => section.classList.contains(`products__${cls}`));
            section.style.display = show ? '' : 'none';
        });
    }
}

function updateUI() {
    const activeBtns = [...buttons].filter(b => b.classList.contains('active'));
    const activeClasses = activeBtns.map(btn => {
        // У кнопок классы типа filtration__key-rings, берем часть после filtration__
        const cls = [...btn.classList].find(c => c.startsWith('filtration__'));
        return cls ? cls.replace('filtration__', '') : '';
    });

    // Обновляем кнопки "всё"
    const anyActive = activeBtns.length > 0;
    if (anyActive) {
        allBtn.classList.add('inactive');
        allBtn.classList.remove('active');
    } else {
        allBtn.classList.remove('inactive');
        allBtn.classList.add('active');
    }

    // Если все кнопки активны — сбрасываем и активируем "всё"
    if (activeClasses.length === buttons.length) {
        buttons.forEach(b => b.classList.remove('active'));
        allBtn.classList.remove('inactive');
        allBtn.classList.add('active');
        showSections(['all']);
    } else {
        showSections(activeClasses);
    }
}

allBtn.addEventListener('click', () => {
    buttons.forEach(b => b.classList.remove('active'));
    allBtn.classList.remove('inactive');
    allBtn.classList.add('active');
    showSections(['all']);
});

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) {
            btn.classList.remove('active');
        } else {
            btn.classList.add('active');
        }
        updateUI();
    });
});

// Инициализация при загрузке страницы
updateUI();







const html = document.documentElement;
const body = document.body;

// Функция для проверки видимости элемента
function isVisible(el) {
    return el && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden' && el.offsetParent !== null;
}

// Вынесем логику открытия модалки в отдельную функцию,
// чтобы можно было открыть модалку как по клику на карточку, так и по кнопке баннера
function openProductModal(card) {
    const modal = document.getElementById('productsModal');
    const title = card.dataset.title;
    const price = card.dataset.price;
    const size = card.dataset.size;
    const description = JSON.parse(card.dataset.description);
    const images = JSON.parse(card.dataset.images);
    const maxCount = parseInt(card.dataset.count) || 1;

    const addBtn = card.querySelector('.products__btn');
    const counter = card.querySelector('.products__counter');
    const counterCountSpan = counter.querySelector('.products__count');
    const currentCount = parseInt(counterCountSpan.textContent) || 1;

    // Заполняем данные модалки
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

    const modalControls = modal.querySelector('.modal__controls');
    const modalAddCartBtn = modal.querySelector('.modal__add-cart');
    const modalCountSpan = modal.querySelector('.modal__count');
    const modalDecreaseBtn = modal.querySelector('.modal__decrease');
    const modalIncreaseBtn = modal.querySelector('.modal__increase');

    function updateModalButtons(count) {
        modalCountSpan.textContent = count;
        modalDecreaseBtn.disabled = count <= 0;
        modalIncreaseBtn.disabled = count >= maxCount;
    }

    if (isVisible(addBtn)) {
        // Кнопка видна — показываем её, прячем счётчик в модалке
        modalControls.classList.remove('active');
        modalAddCartBtn.classList.remove('hidden');
        modalCountSpan.textContent = '1';
    } else if (isVisible(counter)) {
        // Счётчик виден — показываем счётчик в модалке с текущим значением
        modalControls.classList.add('active');
        modalAddCartBtn.classList.add('hidden');
        modalCountSpan.textContent = currentCount;

        updateModalButtons(currentCount);

        modalDecreaseBtn.onclick = () => {
            let count = parseInt(modalCountSpan.textContent);
            if (count > 0) {
                count--;
                updateModalButtons(count);
                modalCountSpan.textContent = count;
                counterCountSpan.textContent = count;

                if (count === 0) {
                    modalControls.classList.remove('active');
                    modalAddCartBtn.classList.remove('hidden');

                    // В карточке тоже меняем вид обратно
                    addBtn.style.display = '';
                    counter.style.display = 'none';
                }
            }
        };

        modalIncreaseBtn.onclick = () => {
            let count = parseInt(modalCountSpan.textContent);
            if (count < maxCount) {
                count++;
                updateModalButtons(count);
                modalCountSpan.textContent = count;
                counterCountSpan.textContent = count;

                if (count > 0) {
                    modalControls.classList.add('active');
                    modalAddCartBtn.classList.add('hidden');

                    addBtn.style.display = 'none';
                    counter.style.display = 'flex';
                }
            }
        };
    } else {
        modalControls.classList.remove('active');
        modalAddCartBtn.classList.remove('hidden');
        modalCountSpan.textContent = '1';
    }

    // Клик по кнопке "положить в корзинку" в модалке
    modalAddCartBtn.onclick = () => {
        modalAddCartBtn.classList.add('hidden');
        modalControls.classList.add('active');
        modalCountSpan.textContent = '1';

        // Обновляем карточку: скрываем кнопку, показываем счетчик с 1
        addBtn.style.display = 'none';
        counter.style.display = 'flex';
        counterCountSpan.textContent = '1';
    };

    modal.style.display = 'flex';
    html.classList.add('modal-open');
    body.classList.add('modal-open');
}

// Обработчик клика на карточки (оставляем почти как есть, просто вызываем функцию)
document.querySelectorAll('.products__card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (
            !e.target.closest('.products__btn') &&
            !e.target.closest('.products__counter')
        ) {
            openProductModal(card);
        }
    });
});

// Добавляем обработчики для кнопок на баннерах
document.querySelectorAll('.banners__banner').forEach(banner => {
    const btn = banner.querySelector('button');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const productId = banner.dataset.productId;
        if (!productId) return;

        const card = document.querySelector(`.products__card[data-product-id="${productId}"]`);
        if (card) {
            openProductModal(card);
        }
    });
});

document.querySelector('.modal__close').addEventListener('click', () => {
    document.getElementById('productsModal').style.display = 'none';
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

window.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('productsModal');
    modal.style.display = 'none';
    html.classList.remove('modal-open');
    body.classList.remove('modal-open');
});



