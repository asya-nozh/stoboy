document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.header__open');
  const menuIcon = menuButton.querySelector('img');
  const mobileNav = document.querySelector('.header__mobile-nav');
  const overlay = document.querySelector('.menu-overlay');
  const assetBase = window.location.pathname.includes('/pages/') ? '../assets' : 'assets';

  const store = window.StoboyStore;
  if (store) {
    const cartLink = document.querySelector('.header__controls a[href*="cart.html"]');
    const accountLink = document.querySelector('.header__controls a[href*="account.html"]');
    function updateCartBadge() {
      if (!cartLink) return;
      const cartCount = store.getCart().reduce((sum, item) => sum + item.quantity, 0);
      let badge = cartLink.querySelector('.header__cart-badge');
      if (cartCount === 0) {
        badge?.remove();
        return;
      }
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'header__cart-badge';
        cartLink.appendChild(badge);
      }
      badge.textContent = cartCount > 99 ? '99+' : String(cartCount);
      badge.setAttribute('aria-label', `Товаров в корзине: ${cartCount}`);
    }
    updateCartBadge();
    window.addEventListener('stoboy:cart-changed', updateCartBadge);
    const currentUser = store.getCurrentUser();
    if (accountLink && currentUser) accountLink.title = `Аккаунт: ${currentUser.firstname}`;
  }

  function toggleMenu() {
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');

    // Меняем иконку
    if (mobileNav.classList.contains('active')) {
      menuIcon.src = `${assetBase}/images/ui/close-menu.svg`;
    } else {
      menuIcon.src = `${assetBase}/images/ui/open-menu.svg`;
    }
  }

  function closeMenu() {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    menuIcon.src = `${assetBase}/images/ui/open-menu.svg`;
  }

  // Открытие / закрытие меню
  menuButton.addEventListener('click', toggleMenu);

  // Закрытие по клику вне меню или на любую ссылку
  document.addEventListener('click', function (e) {
    if (
      e.target.closest('.header__mobile-nav a') ||
      e.target.closest('.header__controls a') ||
      e.target.closest('.header__logo a')
    ) {
      closeMenu();
    }

    if (!mobileNav.contains(e.target) && !menuButton.contains(e.target) && overlay.classList.contains('active')) {
      closeMenu();
    }
  });
});
