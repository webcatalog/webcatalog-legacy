var $toggle = document.querySelector('#nav-toggle');
var $menu = document.querySelector('#nav-menu');

$toggle.onclick = function() {
  $toggle.classList.toggle('is-active');
  $menu.classList.toggle('is-active');
};
