(function () {
  'use strict';

  const STORAGE_KEY = 'stoboy-store-v2';

  const products = [
    { id: 'keyring-sleepy', title: '«Слипи гача»', price: 400, stock: 2, image: 'assets/images/pages/catalog/key-rings-sleepy-gacha.webp', size: '2,5 см', description: ['Двухслойный акрил', 'Фурнитура: белая, бирюзовая или лавандовая нить'] },
    { id: 'keyring-marzipan', title: '«Ангел Марципан»', price: 400, stock: 3, image: 'assets/images/pages/catalog/key-rings-angel-marzipan.webp', size: '3,5 см', description: ['Розовый блестящий акрил', 'Розовый карабин'] },
    { id: 'keyring-moti', title: '«Ангел Моти»', price: 400, stock: 4, image: 'assets/images/pages/catalog/key-rings-angel-moty.webp', size: '3,5 см', description: ['Блестящий акрил со звёздами', 'Голубой карабин'] },
    { id: 'keyring-tofu', title: '«Ангел Тофу»', price: 400, stock: 5, image: 'assets/images/pages/catalog/key-rings-angel-tofu.webp', size: '3,5 см', description: ['Блестящий акрил с крупными звёздами', 'Бирюзовый карабин'] },
    { id: 'sticker-emoji', title: '«Эмодзи»', price: 100, stock: 10, image: 'assets/images/pages/catalog/key-rings-sleepy-gacha.webp', size: 'А6', description: ['Прозрачная плёнка'] },
    { id: 'sticker-paws', title: '«Подушечки»', price: 100, stock: 8, image: 'assets/images/pages/catalog/key-rings-angel-marzipan.webp', size: 'А7', description: ['Прозрачная плёнка'] },
    { id: 'sticker-sleepy', title: '«Сонные»', price: 100, stock: 6, image: 'assets/images/pages/catalog/key-rings-angel-moty.webp', size: 'А7', description: ['Прозрачная плёнка'] },
    { id: 'sticker-micro', title: '«Микростикеры»', price: 100, stock: 0, image: 'assets/images/pages/catalog/key-rings-angel-tofu.webp', size: 'А6', description: ['Прозрачная плёнка'] },
    { id: 'card-sleepy', title: 'Карточка «Слипи гача»', price: 150, stock: 7, image: 'assets/images/pages/catalog/key-rings-sleepy-gacha.webp', size: '10 × 15 см', description: ['Плотная матовая бумага'] },
    { id: 'card-marzipan', title: 'Карточка «Марципан»', price: 150, stock: 5, image: 'assets/images/pages/catalog/key-rings-angel-marzipan.webp', size: '10 × 15 см', description: ['Плотная матовая бумага'] },
    { id: 'card-moti', title: 'Карточка «Моти»', price: 150, stock: 4, image: 'assets/images/pages/catalog/key-rings-angel-moty.webp', size: '10 × 15 см', description: ['Плотная матовая бумага'] },
    { id: 'card-tofu', title: 'Карточка «Тофу»', price: 150, stock: 3, image: 'assets/images/pages/catalog/key-rings-angel-tofu.webp', size: '10 × 15 см', description: ['Плотная матовая бумага'] },
    { id: 'badge-sleepy', title: 'Значок «Слипи гача»', price: 250, stock: 6, image: 'assets/images/pages/catalog/key-rings-sleepy-gacha.webp', size: '38 мм', description: ['Металлический значок'] },
    { id: 'badge-marzipan', title: 'Значок «Марципан»', price: 250, stock: 4, image: 'assets/images/pages/catalog/key-rings-angel-marzipan.webp', size: '38 мм', description: ['Металлический значок'] },
    { id: 'badge-moti', title: 'Значок «Моти»', price: 250, stock: 3, image: 'assets/images/pages/catalog/key-rings-angel-moty.webp', size: '38 мм', description: ['Металлический значок'] },
    { id: 'badge-tofu', title: 'Значок «Тофу»', price: 250, stock: 2, image: 'assets/images/pages/catalog/key-rings-angel-tofu.webp', size: '38 мм', description: ['Металлический значок'] },
    { id: 'certificate', title: 'Подарочный сертификат', price: 1000, stock: 30, image: 'assets/images/pages/catalog/other-certificate.webp', size: 'Электронный', description: ['Номинал 1000 рублей', 'Приходит на электронную почту'] },
    { id: 'box1', title: 'BOX «peache & stoboy»', price: 2500, stock: 10, image: 'assets/images/pages/catalog/other-box.webp', size: '20 × 30 см', description: ['Фигурка Марципана', 'Значок в форме сердца', 'Пак стикеров и карточка'] }
  ];

  const productById = Object.fromEntries(products.map(product => [product.id, product]));

  function order(id, date, status, address, deliveryType, trackNumber, items, receivedDate = '') {
    return { id, date, status, address, deliveryType, trackNumber, items, receivedDate };
  }

  const seedUsers = [
    {
      id: 'user-demo', firstname: 'Анна', surname: 'Соколова', patronymic: '',
      phone: '+7 (999) 111-22-33', email: 'demo@stoboy.ru', password: 'demo123',
      orders: [
        order('STB-1042', '2026-10-18', 'В пути', 'Москва, ул. Тихомирова, 10', 'Пункт выдачи CDEK', '1364827590', [
          { productId: 'keyring-marzipan', quantity: 2, price: 400 },
          { productId: 'sticker-emoji', quantity: 1, price: 100 }
        ]),
        order('STB-0981', '2026-09-27', 'Получен', 'Москва, проспект Мира, 95', 'Курьерская доставка', '2749183650', [
          { productId: 'box1', quantity: 1, price: 2500 },
          { productId: 'card-moti', quantity: 2, price: 150 }
        ], '2026-10-01')
      ]
    },
    {
      id: 'user-maria', firstname: 'Мария', surname: 'Орлова', patronymic: 'Ильинична',
      phone: '+7 (921) 444-55-66', email: 'maria@stoboy.ru', password: 'maria123',
      orders: [
        order('STB-1035', '2026-10-12', 'Готовится к отправке', 'Санкт-Петербург, Лиговский проспект, 74Д', 'Пункт выдачи CDEK', '', [
          { productId: 'keyring-tofu', quantity: 1, price: 400 },
          { productId: 'badge-sleepy', quantity: 2, price: 250 },
          { productId: 'sticker-paws', quantity: 3, price: 100 }
        ])
      ]
    },
    {
      id: 'user-empty', firstname: 'Лиза', surname: 'Котова', patronymic: '',
      phone: '+7 (912) 777-88-99', email: 'new@stoboy.ru', password: 'newuser1', orders: []
    }
  ];

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function createInitialState() {
    return {
      version: 2,
      products: Object.fromEntries(products.map(product => [product.id, { stock: product.stock }])),
      users: clone(seedUsers),
      cart: [],
      currentUserId: null
    };
  }

  function load() {
    try {
      const state = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (state && state.version === 2 && Array.isArray(state.users) && Array.isArray(state.cart)) {
        products.forEach(product => {
          if (!state.products[product.id]) state.products[product.id] = { stock: product.stock };
        });
        state.users.forEach(user => {
          (user.orders || []).forEach(userOrder => {
            if (typeof userOrder.receivedDate !== 'string') {
              userOrder.receivedDate = userOrder.id === 'STB-0981'
                ? '2026-10-01'
                : (userOrder.status === 'Получен' ? userOrder.date : '');
            }
          });
        });
        save(state);
        return state;
      }
    } catch (error) {
      console.warn('Не удалось прочитать данные магазина, используется новое хранилище.', error);
    }
    const state = createInitialState();
    save(state);
    return state;
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function notifyCartChanged() {
    if (typeof window.dispatchEvent === 'function' && typeof window.CustomEvent === 'function') {
      window.dispatchEvent(new CustomEvent('stoboy:cart-changed'));
    }
  }

  function getProducts() {
    const state = load();
    return products.map(product => ({ ...clone(product), stock: state.products[product.id].stock }));
  }

  function getProduct(id) {
    return getProducts().find(product => product.id === id) || null;
  }

  function getCart() {
    return clone(load().cart);
  }

  function setCartQuantity(productId, quantity) {
    const state = load();
    const product = productById[productId];
    if (!product) throw new Error('Товар не найден');
    const stock = state.products[productId].stock;
    const safeQuantity = Math.max(0, Math.min(Number(quantity) || 0, stock));
    const index = state.cart.findIndex(item => item.productId === productId);
    if (safeQuantity === 0 && index >= 0) state.cart.splice(index, 1);
    if (safeQuantity > 0 && index >= 0) state.cart[index].quantity = safeQuantity;
    if (safeQuantity > 0 && index < 0) state.cart.push({ productId, quantity: safeQuantity });
    save(state);
    notifyCartChanged();
    return safeQuantity;
  }

  function cartDetails() {
    const state = load();
    const items = state.cart.map(item => {
      const product = productById[item.productId];
      const stock = state.products[item.productId]?.stock || 0;
      return product ? { ...clone(product), stock, quantity: Math.min(item.quantity, stock) } : null;
    }).filter(Boolean).filter(item => item.quantity > 0);
    return { items, total: items.reduce((sum, item) => sum + item.price * item.quantity, 0) };
  }

  function normalizeEmail(value) {
    return String(value || '').trim().toLowerCase();
  }

  function normalizePhone(value) {
    return String(value || '').replace(/\D/g, '');
  }

  function register(data) {
    const state = load();
    const email = normalizeEmail(data.email);
    const phone = normalizePhone(data.phone);
    if (state.users.some(user => normalizeEmail(user.email) === email)) throw new Error('Пользователь с такой почтой уже зарегистрирован');
    if (state.users.some(user => normalizePhone(user.phone) === phone)) throw new Error('Пользователь с таким телефоном уже зарегистрирован');
    const user = {
      id: `user-${Date.now()}`,
      firstname: data.firstname.trim(), surname: '', patronymic: '',
      phone: data.phone.trim(), email, password: data.password, orders: []
    };
    state.users.push(user);
    state.currentUserId = user.id;
    save(state);
    return clone(user);
  }

  function login(credentials) {
    const state = load();
    const email = normalizeEmail(credentials.email);
    const phone = normalizePhone(credentials.phone);
    const user = state.users.find(item =>
      ((email && normalizeEmail(item.email) === email) || (phone && normalizePhone(item.phone) === phone)) &&
      item.password === credentials.password
    );
    if (!user) throw new Error('Неверная почта, телефон или пароль');
    state.currentUserId = user.id;
    save(state);
    return clone(user);
  }

  function logout() {
    const state = load();
    state.currentUserId = null;
    save(state);
  }

  function getCurrentUser() {
    const state = load();
    const user = state.users.find(item => item.id === state.currentUserId);
    return user ? clone(user) : null;
  }

  function updateProfile(profile) {
    const state = load();
    const user = state.users.find(item => item.id === state.currentUserId);
    if (!user) throw new Error('Сначала войдите в аккаунт');
    const email = normalizeEmail(profile.email);
    const phone = normalizePhone(profile.phone);
    if (state.users.some(item => item.id !== user.id && normalizeEmail(item.email) === email)) throw new Error('Эта почта уже используется');
    if (state.users.some(item => item.id !== user.id && normalizePhone(item.phone) === phone)) throw new Error('Этот телефон уже используется');
    Object.assign(user, { ...profile, email });
    save(state);
    return clone(user);
  }

  function checkout(delivery) {
    const state = load();
    const user = state.users.find(item => item.id === state.currentUserId);
    if (!user) throw new Error('Сначала войдите в аккаунт');
    if (!state.cart.length) throw new Error('Корзина пуста');
    const items = state.cart.map(item => {
      const product = productById[item.productId];
      const available = state.products[item.productId]?.stock || 0;
      if (!product || available < item.quantity) throw new Error(`Недостаточно товара «${product?.title || item.productId}»`);
      return { productId: item.productId, quantity: item.quantity, price: product.price };
    });
    items.forEach(item => { state.products[item.productId].stock -= item.quantity; });
    const now = new Date();
    const newOrder = order(
      `STB-${String(Date.now()).slice(-6)}`,
      now.toISOString().slice(0, 10),
      'Готовится к отправке',
      delivery.address.trim(),
      delivery.deliveryType,
      '',
      items
    );
    user.orders.unshift(newOrder);
    state.cart = [];
    save(state);
    notifyCartChanged();
    return clone(newOrder);
  }

  function orderTotal(orderData) {
    return orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function formatMoney(value) {
    return `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;
  }

  function productTitle(productId) {
    return productById[productId]?.title || 'Товар';
  }

  function productImage(productId) {
    return productById[productId]?.image || '';
  }

  function asset(path) {
    return `../${path}`;
  }

  window.StoboyStore = {
    productIds: products.map(product => product.id),
    getProducts, getProduct, getCart, setCartQuantity, cartDetails,
    register, login, logout, getCurrentUser, updateProfile, checkout,
    orderTotal, formatMoney, productTitle, productImage, asset
  };
})();
