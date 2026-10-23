document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.querySelector('.header__open');
  const menuIcon = menuButton.querySelector('img');
  const mobileNav = document.querySelector('.header__mobile-nav');
  const overlay = document.querySelector('.menu-overlay');

  function toggleMenu() {
    mobileNav.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('no-scroll');

    // Меняем иконку
    if (mobileNav.classList.contains('active')) {
      menuIcon.src = '/assets/images/ui/close-menu.svg';
    } else {
      menuIcon.src = '/assets/images/ui/open-menu.svg';
    }
  }

  function closeMenu() {
    mobileNav.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
    menuIcon.src = '/assets/images/ui/open-menu.svg';
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