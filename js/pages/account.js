'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const store = window.StoboyStore;
  const user = store.getCurrentUser();
  const sections = Array.from(document.querySelectorAll('.account__sections'));
  const navigationButtons = Array.from(document.querySelectorAll('.navigation__links button'));
  const exitButton = document.querySelector('.navigation__exit');
  const accountContent = document.querySelector('.account__content');

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, symbol => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[symbol]));
  }

  function formatDate(value) {
    return new Intl.DateTimeFormat('ru-RU').format(new Date(`${value}T12:00:00`));
  }

  function activate(target) {
    sections.forEach(section => section.classList.toggle('active', section.dataset.section === target));
    navigationButtons.forEach(button => button.classList.toggle('active', button.dataset.target === target));
    exitButton?.classList.toggle('active', target === 'exit');
    document.querySelector('.account-auth-required')?.classList.toggle('active', target === 'auth');
  }

  navigationButtons.forEach(button => button.addEventListener('click', () => activate(button.dataset.target)));
  exitButton?.addEventListener('click', () => activate('exit'));

  if (!user) {
    ['deliveries', 'orders', 'personal'].forEach(target => {
      document.querySelector(`.navigation__links button[data-target="${target}"]`)?.closest('div')?.setAttribute('hidden', '');
    });
    exitButton.hidden = true;
    sections.filter(section => section.dataset.section !== 'privacy').forEach(section => { section.hidden = true; });
    const authRequired = document.createElement('section');
    authRequired.className = 'account-auth-required active';
    authRequired.innerHTML = '<h2>личный кабинет доступен после входа</h2><p>Авторизуйтесь, чтобы видеть свои покупки, доставки и личные данные.</p><a href="log-reg.html">войти или зарегистрироваться</a>';
    accountContent.prepend(authRequired);
    activate('auth');
    return;
  }

  renderDeliveries(user.orders);
  renderOrders(user.orders);
  initializeProfile(user);
  initializeLogout();
  activate('deliveries');

  function deliveryLabel(value) {
    return String(value || '').replace('CDEK', 'СДЭК');
  }

  function itemCards(order, cardClass) {
    return order.items.map(item => {
      const product = store.getProduct(item.productId);
      const title = product?.title || store.productTitle(item.productId);
      const image = product?.image ? store.asset(product.image) : '';
      return `<article class="${cardClass}">
        ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" loading="lazy">` : ''}
        <h3>${escapeHtml(title)}</h3>
        <p>${item.quantity} × ${store.formatMoney(item.price)}</p>
        <p class="order-item__total">${store.formatMoney(item.quantity * item.price)}</p>
      </article>`;
    }).join('');
  }

  function renderDeliveries(orders) {
    const container = document.querySelector('.deliveries');
    if (!orders.length) {
      container.innerHTML = '<section class="store-empty account__section-content"><h2>доставок пока нет</h2><p>После оформления заказа здесь появится его статус.</p><a href="catalog.html">перейти в каталог</a></section>';
      return;
    }
    container.innerHTML = orders.map(order => `
      <section class="delivery">
        <div class="delivery__content account__section-content">
          <h2><span>//</span> заказ ${escapeHtml(order.id)} от <time datetime="${order.date}">${formatDate(order.date)}</time></h2>
          <div class="delivery__content_top">
            <div class="delivery__adress"><img src="../assets/images/common/stickers/map.svg" alt=""><p><span>${escapeHtml(order.address)}</span><span>${escapeHtml(deliveryLabel(order.deliveryType))}</span></p></div>
            ${order.trackNumber ? `<button class="delivery__track-number" type="button">трек-номер <span>${escapeHtml(order.trackNumber)}</span></button>` : '<p class="delivery__status">трек-номер появится после отправки</p>'}
          </div>
          <div class="delivery__content_center">${itemCards(order, 'delivery__card')}</div>
          <div class="delivery__content_bottom">
            <div class="delivery__links">
              ${order.trackNumber && /CDEK|СДЭК/i.test(order.deliveryType) ? `<a class="delivery__tracking-link" href="https://www.cdek.ru/ru/tracking" target="_blank" rel="noopener">&gt; отследить на сайте СДЭК</a>` : ''}
              <a href="../index.html#faq">? появился вопрос</a>
            </div>
            <div class="delivery__sum"><p class="delivery__state">${escapeHtml(order.status)}</p><p>итого: <span>${store.formatMoney(store.orderTotal(order))}</span></p></div>
          </div>
        </div>
      </section>`).join('');
    container.querySelectorAll('.delivery__track-number').forEach(button => button.addEventListener('click', async () => {
      const track = button.querySelector('span').textContent;
      try {
        await navigator.clipboard.writeText(track);
        const original = button.innerHTML;
        button.textContent = 'скопировано';
        setTimeout(() => { button.innerHTML = original; }, 1500);
      } catch (_) {
        button.title = track;
      }
    }));
  }

  function renderOrders(orders) {
    const container = document.querySelector('.orders');
    if (!orders.length) {
      container.innerHTML = '<section class="store-empty account__section-content"><h2>покупок пока нет</h2><p>Соберите первую корзинку — заказ появится здесь.</p><a href="catalog.html">перейти в каталог</a></section>';
      return;
    }
    container.innerHTML = orders.map(order => `
      <section class="order">
        <div class="order__content account__section-content">
          <h2><span>//</span> заказ ${escapeHtml(order.id)} от <time datetime="${order.date}">${formatDate(order.date)}</time></h2>
          <div class="order__content_top">
            <div class="order__adress"><img src="../assets/images/common/stickers/map.svg" alt=""><p><span>${escapeHtml(order.address)}</span><span>${escapeHtml(deliveryLabel(order.deliveryType))}</span></p></div>
            <div class="order__date">${order.receivedDate ? `получен <time datetime="${order.receivedDate}">${formatDate(order.receivedDate)}</time>` : `<span>${escapeHtml(order.status)}</span>`}</div>
          </div>
          <div class="order__content_center">${itemCards(order, 'order__card')}</div>
          <div class="order__content_bottom"><div class="order__links"><a href="../index.html#faq">? появился вопрос</a></div><div class="order__sum"><p>итого: <span>${store.formatMoney(store.orderTotal(order))}</span></p></div></div>
        </div>
      </section>`).join('');
  }

  function initializeProfile(currentUser) {
    const form = document.getElementById('questionForm');
    if (!form) return;
    const fields = ['surname', 'firstname', 'patronymic', 'phone', 'email'];
    fields.forEach(name => { form.elements[name].value = currentUser[name] || ''; });
    document.querySelector('.personal__name').textContent = currentUser.firstname;
    form.addEventListener('submit', event => {
      event.preventDefault();
      fields.forEach(name => {
        form.elements[name].classList.remove('invalid');
        form.querySelector(`.personal__error_${name}`).textContent = '';
      });
      const data = Object.fromEntries(fields.map(name => [name, form.elements[name].value.trim()]));
      let invalid = false;
      ['surname', 'firstname'].forEach(name => {
        if (!/^[а-яА-ЯёЁa-zA-Z-]{2,50}$/.test(data[name])) {
          form.elements[name].classList.add('invalid');
          form.querySelector(`.personal__error_${name}`).textContent = 'Введите корректное значение';
          invalid = true;
        }
      });
      if (data.phone.replace(/\D/g, '').length !== 11) {
        form.elements.phone.classList.add('invalid');
        form.querySelector('.personal__error_phone').textContent = 'Введите телефон из 11 цифр';
        invalid = true;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        form.elements.email.classList.add('invalid');
        form.querySelector('.personal__error_email').textContent = 'Введите корректную почту';
        invalid = true;
      }
      if (invalid) return;
      try {
        const updated = store.updateProfile(data);
        document.querySelector('.personal__name').textContent = updated.firstname;
        const submit = form.querySelector('.personal__submit');
        submit.textContent = 'сохранено';
        setTimeout(() => { submit.textContent = 'сохранить изменения'; }, 1600);
      } catch (profileError) {
        form.querySelector('.personal__error_email').textContent = profileError.message;
      }
    });
  }

  function initializeLogout() {
    const cancel = document.querySelector('.exit__btn-no');
    const confirm = document.querySelector('.exit__btn-yes');
    cancel?.addEventListener('click', event => { event.preventDefault(); activate('personal'); });
    confirm?.addEventListener('click', event => {
      event.preventDefault();
      store.logout();
      window.location.href = '../index.html';
    });
  }
});
