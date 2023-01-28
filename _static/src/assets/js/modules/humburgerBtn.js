// hamburger btn
const hamburgerToggle = document.getElementById('js-hamburger-toggle');
const menu = document.getElementById('js-menu');
const menuBg = document.getElementById('js-menu-bg');

hamburgerToggle.addEventListener('click', function () {
  hamburgerToggle.classList.toggle('is-active');
  menu.classList.toggle('is-active');
  menuBg.classList.toggle('is-active');
});
