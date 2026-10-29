'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const store = window.StoboyStore;
  const cards = Array.from(document.querySelectorAll('.products__card'));
  const modal = document.getElementById('productsModal');
  const html = document.documentElement;
  const body = document.body;

  cards.forEach((card, index) => {
    const productId = store.productIds[index];
    const product = store.getProduct(productId);
    if (!product) return;
    card.dataset.productId = productId;
    card.dataset.price = String(product.price);
    card.dataset.count = String(product.stock);
    card.dataset.title = product.title;
    card.dataset.size = product.size;
    card.dataset.description = JSON.stringify(product.description);
    card.dataset.images = JSON.stringify([store.asset(product.image)]);
    const title = card.querySelector('h3');
    const price = card.querySelector('.products__price');
    if (title) title.textContent = product.title;
    if (price) price.textContent = store.formatMoney(product.price);
    ensureStockLabel(card);
    bindCard(card);
    syncCard(card);
  });

  function ensureStockLabel(card) {
    let label = card.querySelector('.products__stock');
    if (!label) {
      label = document.createElement('p');
      label.className = 'products__stock';
      card.querySelector('.products__price')?.after(label);
    }
    return label;
  }

  function cartQuantity(productId) {
    return store.getCart().find(item => item.productId === productId)?.quantity || 0;
  }

  function syncCard(card) {
    const product = store.getProduct(card.dataset.productId);
    if (!product) return;
    const quantity = cartQuantity(product.id);
    const addButton = card.querySelector('.products__btn');
    const counter = card.querySelector('.products__counter');
    const count = card.querySelector('.products__count');
    const increase = card.querySelector('.products__increase');
    const stockLabel = ensureStockLabel(card);
    card.classList.toggle('products__card_sold-out', product.stock === 0);
    stockLabel.textContent = product.stock === 0 ? 'раскупили' : `в наличии: ${product.stock}`;
    stockLabel.classList.toggle('products__stock_sold-out', product.stock === 0);
    addButton.disabled = product.stock === 0;
    addButton.textContent = product.stock === 0 ? 'раскупили' : 'в корзинку';
    addButton.classList.toggle('hidden', quantity > 0);
    counter.classList.toggle('active', quantity > 0);
    if (count) count.textContent = String(quantity || 1);
    if (increase) increase.disabled = quantity >= product.stock;
  }

  function bindCard(card) {
    const addButton = card.querySelector('.products__btn');
    const decrease = card.querySelector('.products__decrease');
    const increase = card.querySelector('.products__increase');
    addButton.addEventListener('click', event => {
      event.stopPropagation();
      const product = store.getProduct(card.dataset.productId);
      if (product?.stock > 0) store.setCartQuantity(product.id, 1);
      syncCard(card);
    });
    decrease.addEventListener('click', event => {
      event.stopPropagation();
      store.setCartQuantity(card.dataset.productId, cartQuantity(card.dataset.productId) - 1);
      syncCard(card);
    });
    increase.addEventListener('click', event => {
      event.stopPropagation();
      store.setCartQuantity(card.dataset.productId, cartQuantity(card.dataset.productId) + 1);
      syncCard(card);
    });
    card.addEventListener('click', event => {
      if (!event.target.closest('button')) openProductModal(card.dataset.productId);
    });
  }

  function openProductModal(productId) {
    const product = store.getProduct(productId);
    if (!product || !modal) return;
    document.getElementById('modalTitle').textContent = product.title;
    document.getElementById('modalTitleDupl').textContent = product.title;
    document.getElementById('modalPrice').textContent = store.formatMoney(product.price);
    document.getElementById('modalSize').textContent = `Размер: ${product.size}`;
    document.getElementById('modalDescription').innerHTML = product.description.map(item => `<li>${item}</li>`).join('');
    document.getElementById('modalImages').innerHTML = `<div class="modal__images-wrapper"><img class="modal__main-image" src="${store.asset(product.image)}" alt="${product.title}"></div>`;
    const controls = modal.querySelector('.modal__controls');
    const addButton = modal.querySelector('.modal__add-cart');
    const count = modal.querySelector('.modal__count');
    const decrease = modal.querySelector('.modal__decrease');
    const increase = modal.querySelector('.modal__increase');

    function syncModal() {
      const freshProduct = store.getProduct(productId);
      const quantity = cartQuantity(productId);
      count.textContent = String(quantity || 1);
      controls.classList.toggle('active', quantity > 0);
      addButton.classList.toggle('hidden', quantity > 0);
      addButton.disabled = freshProduct.stock === 0;
      addButton.textContent = freshProduct.stock === 0 ? 'раскупили' : 'положить в корзинку';
      decrease.disabled = quantity <= 0;
      increase.disabled = quantity >= freshProduct.stock;
      const card = cards.find(item => item.dataset.productId === productId);
      if (card) syncCard(card);
    }

    addButton.onclick = () => { store.setCartQuantity(productId, 1); syncModal(); };
    decrease.onclick = () => { store.setCartQuantity(productId, cartQuantity(productId) - 1); syncModal(); };
    increase.onclick = () => { store.setCartQuantity(productId, cartQuantity(productId) + 1); syncModal(); };
    syncModal();
    modal.style.display = 'flex';
    html.classList.add('modal-open');
    body.classList.add('modal-open');
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    html.classList.remove('modal-open');
    body.classList.remove('modal-open');
  }

  modal?.querySelector('.modal__close')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  closeModal();
  document.querySelectorAll('.banners__banner').forEach(banner => {
    banner.querySelector('button')?.addEventListener('click', () => openProductModal(banner.dataset.productId));
  });

  const allButton = document.querySelector('.filtration__all');
  const filterButtons = Array.from(document.querySelectorAll('.filtration__buttons button'));
  const sections = Array.from(document.querySelectorAll('.products__section'));
  function updateFilters() {
    const active = filterButtons.filter(button => button.classList.contains('active')).map(button =>
      Array.from(button.classList).find(name => name.startsWith('filtration__'))?.replace('filtration__', '')
    );
    const showAll = active.length === 0;
    allButton.classList.toggle('active', showAll);
    allButton.classList.toggle('inactive', !showAll);
    sections.forEach(section => {
      section.style.display = showAll || active.some(name => section.classList.contains(`products__${name}`)) ? '' : 'none';
    });
  }
  allButton.addEventListener('click', () => {
    filterButtons.forEach(button => button.classList.remove('active'));
    updateFilters();
  });
  filterButtons.forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('active');
    updateFilters();
  }));
  updateFilters();
});
