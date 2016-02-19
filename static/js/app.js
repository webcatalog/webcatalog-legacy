$(document).ready(function ($) {

  // All pages
  var $toggle = $('#header-toggle');
  var $menu = $('#header-menu');

  $toggle.click(function() {
    $(this).toggleClass('is-active');
    $menu.toggleClass('is-active');
  });

  // Single
  var $tab = $('#platforms li');
  if ($tab.length) {
    function setTab(e) {
      $tab.removeClass('is-active');
      e.addClass('is-active');
      $i = e.text();
      $('.platform-content').addClass('is-hidden-mobile is-hidden-tablet');
      $('#content-' + $i).removeClass('is-hidden-mobile is-hidden-tablet');
    }

    $tab.click(function() {
      setTab($(this));
    });

    var userAgent = navigator.userAgent;
    if (navigator.userAgent.indexOf('Win') != -1) $os = 'windows';
    if (navigator.userAgent.indexOf('Mac') != -1) $os = 'osx';
    if (navigator.userAgent.indexOf('Linux') != -1) $os = 'linux';
    if ( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) $os = 'ios';
    if ( userAgent.match( /Android/i ) ) $os = 'android';

    $osTab = $('#platform-' + $os);
    setTab($osTab);
  }

  $('#search-form').on('submit', function(e) {
    e.preventDefault();
    window.location.href = "/search/#" + $('#search-input').val();
  });
});
