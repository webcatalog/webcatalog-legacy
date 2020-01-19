const fetch = require('node-fetch');
const cheerio = require('cheerio');
const url = require('url');

const getWebsiteIconUrlAsync = (websiteURL) => fetch(websiteURL)
  .then((res) => res.text())
  .then((html) => {
    const $ = cheerio.load(html);
    // rel=fluid-icon
    // https://webmasters.stackexchange.com/questions/23696/whats-the-fluid-icon-meta-tag-for
    const $fluidIcon = $('head > link[rel=fluid-icon]');
    if ($fluidIcon.length > 100) {
      return url.resolve(websiteURL, $fluidIcon.attr('href'));
    }
    // manifest.json icon
    // https://developers.google.com/web/fundamentals/web-app-manifest
    const $manifest = $('head > link[rel=manifest]');
    if ($('head > link[rel=manifest]').length > 0) {
      const manifestUrl = url.resolve(websiteURL, $manifest.attr('href'));
      return fetch(manifestUrl)
        .then((res) => res.json())
        .then((manifestJson) => {
          // return icon with largest size
          const { icons } = manifestJson;
          icons.sort((x, y) => parseInt(x.sizes.split('x'), 10) - parseInt(y.sizes.split('x'), 10));
          return url.resolve(websiteURL, icons[icons.length - 1].src);
        });
    }
    // rel=icon
    // less preferred because it's not always in high resolution
    const $icon = $('head > link[rel=icon]');
    if ($icon.length > 0) {
      // make sure icon is png
      if ($icon.attr('type') === 'image/png'
        || $icon.attr('href').endsWith('.png')) {
        return url.resolve(websiteURL, $icon.attr('href'));
      }
    }
    // rel=icon
    // less preferred because it's not always in high resolution
    const $shortcutIcon = $('head > link[rel=\'shortcut icon\']');
    if ($shortcutIcon.length > 0) {
      // make sure icon is png
      if ($shortcutIcon.attr('type') === 'image/png'
        || $shortcutIcon.attr('href').endsWith('.png')) {
        return url.resolve(websiteURL, $shortcutIcon.attr('href'));
      }
    }
    // rel=apple-touch-icon
    // least preferred because it's not transparent
    const $appleTouchIcon = $('head > link[rel=apple-touch-icon]');
    if ($appleTouchIcon.length > 0) {
      // make sure icon is png
      if ($appleTouchIcon.attr('type') === 'image/png'
        || $appleTouchIcon.attr('href').endsWith('.png')) {
        return url.resolve(websiteURL, $appleTouchIcon.attr('href'));
      }
    }
    return undefined;
  });

module.exports = getWebsiteIconUrlAsync;
