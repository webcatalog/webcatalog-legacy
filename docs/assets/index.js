/* eslint-disable */

function loadOS(os) {
  document.querySelectorAll('.mac').forEach(function(el) {
    el.style.display = os === 'mac' ? '' : 'none';
  });
  document.querySelectorAll('.win').forEach(function(el) {
    el.style.display = os === 'win' ? '' : 'none';
  });
  document.querySelectorAll('.linux').forEach(function(el) {
    el.style.display = os === 'linux' ? '' : 'none';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  if (navigator.platform.toUpperCase().indexOf('WIN') > -1) {
    loadOS('win');
  } else if (navigator.platform.toUpperCase().indexOf('LINUX') > -1) {
    loadOS('linux')
  } else {
    loadOS('mac');
  }
});
  