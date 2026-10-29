'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const store = window.StoboyStore;
  const cardsContainer = document.querySelector('.cart__cards');
  const sumElement = document.querySelector('.cart__sum');
  const processing = document.querySelector('.processing__auth');
  const modal = document.getElementById('productsModal');
  if (modal) modal.style.display = 'none';

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, symbol => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[symbol]));
  }

  function renderCart() {
    const { items, total } = store.cartDetails();
    if (!items.length) {
      cardsContainer.innerHTML = '<div class="store-empty"><p>корзинка пока пуста</p><a href="catalog.html">выбрать котят</a></div>';
    } else {
      cardsContainer.innerHTML = items.map(item => `
        <article class="cart__card" data-product-id="${item.id}">
          <div class="cart__left">
            <img src="${store.asset(item.image)}" alt="${escapeHtml(item.title)}">
            <div><h3>${escapeHtml(item.title)}</h3><p class="cart__price">${store.formatMoney(item.price)}</p></div>
          </div>
          <div class="cart__right">
            <div class="cart__counter">
              <button class="cart__decrease" type="button" aria-label="Уменьшить количество">−</button>
              <span class="cart__count">${item.quantity}</span>
              <button class="cart__increase" type="button" aria-label="Увеличить количество" ${item.quantity >= item.stock ? 'disabled' : ''}>+</button>
            </div>
            <button class="cart__remove" type="button" aria-label="Удалить товар"><img src="../assets/images/ui/close.svg" alt=""></button>
          </div>
        </article>`).join('');
    }
    sumElement.textContent = `сумма: ${store.formatMoney(total)}`;
    renderCheckout(items.length > 0);
  }

  function renderCheckout(hasItems) {
    const user = store.getCurrentUser();
    if (!user) {
      processing.innerHTML = '<p>войдите или зарегистрируйтесь, чтобы оформить заказ</p><a href="log-reg.html">авторизоваться</a>';
      return;
    }
    if (!hasItems) {
      processing.innerHTML = `<p>${escapeHtml(user.firstname)}, добавьте товары в корзинку — затем здесь появится оформление заказа.</p><a href="catalog.html">перейти в каталог</a>`;
      return;
    }
    processing.innerHTML = `
      <form class="checkout-form" novalidate>
        <p>заказ оформляется для ${escapeHtml(user.firstname)}</p>
        <label>адрес доставки
          <input name="address" type="text" placeholder="город, улица, дом или пункт выдачи" required>
        </label>
        <label>способ доставки
          <div class="checkout-select" data-checkout-select>
            <input name="deliveryType" type="hidden" value="Пункт выдачи СДЭК">
            <button class="checkout-select__button" type="button" aria-haspopup="listbox" aria-expanded="false">
              <span>Пункт выдачи СДЭК</span><span class="checkout-select__arrow" aria-hidden="true"></span>
            </button>
            <div class="checkout-select__options" role="listbox" hidden>
              <button class="checkout-select__option active" type="button" role="option" aria-selected="true" data-value="Пункт выдачи СДЭК">Пункт выдачи СДЭК</button>
              <button class="checkout-select__option" type="button" role="option" aria-selected="false" data-value="Курьерская доставка">Курьерская доставка</button>
            </div>
          </div>
        </label>
        <p class="checkout-form__error" role="alert"></p>
        <button class="processing__checkout" type="submit">оформить заказ</button>
      </form>`;
    const form = processing.querySelector('.checkout-form');
    const customSelect = form.querySelector('[data-checkout-select]');
    const selectButton = customSelect.querySelector('.checkout-select__button');
    const selectOptions = customSelect.querySelector('.checkout-select__options');
    const selectInput = customSelect.querySelector('input[name="deliveryType"]');

    function closeSelect() {
      customSelect.classList.remove('open');
      selectButton.setAttribute('aria-expanded', 'false');
      selectOptions.hidden = true;
    }

    selectButton.addEventListener('click', () => {
      const willOpen = !customSelect.classList.contains('open');
      if (willOpen) {
        customSelect.classList.add('open');
        selectButton.setAttribute('aria-expanded', 'true');
        selectOptions.hidden = false;
      } else {
        closeSelect();
      }
    });
    selectOptions.addEventListener('click', event => {
      const option = event.target.closest('.checkout-select__option');
      if (!option) return;
      selectInput.value = option.dataset.value;
      selectButton.querySelector('span').textContent = option.dataset.value;
      selectOptions.querySelectorAll('.checkout-select__option').forEach(item => {
        const selected = item === option;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      closeSelect();
    });
    document.addEventListener('click', event => {
      if (!customSelect.contains(event.target)) closeSelect();
    });

    form.addEventListener('submit', event => {
      event.preventDefault();
      const form = event.currentTarget;
      const error = form.querySelector('.checkout-form__error');
      const address = form.elements.address.value.trim();
      if (address.length < 8) {
        error.textContent = 'Укажите полный адрес или адрес пункта выдачи.';
        return;
      }
      try {
        const order = store.checkout({ address, deliveryType: form.elements.deliveryType.value });
        renderCart();
        processing.innerHTML = `<div class="checkout-success"><h3>заказ ${escapeHtml(order.id)} оформлен!</h3><p>Мы сохранили его в личном кабинете.</p><a href="account.html">посмотреть заказ</a></div>`;
      } catch (checkoutError) {
        error.textContent = checkoutError.message;
      }
    });
  }

  cardsContainer.addEventListener('click', event => {
    const card = event.target.closest('.cart__card');
    if (!card) return;
    const productId = card.dataset.productId;
    const quantity = Number(card.querySelector('.cart__count').textContent);
    if (event.target.closest('.cart__decrease')) store.setCartQuantity(productId, quantity - 1);
    if (event.target.closest('.cart__increase')) store.setCartQuantity(productId, quantity + 1);
    if (event.target.closest('.cart__remove')) store.setCartQuantity(productId, 0);
    renderCart();
  });

  renderCart();
});
