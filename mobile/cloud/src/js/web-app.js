if (window.navigator.standalone) {
  window.location.replace(webAppUrl);
}
else {
  document.getElementById('loading').style.display = 'none';
  document.getElementById('guide').style.display = '';
}
