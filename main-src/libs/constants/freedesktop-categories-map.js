/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable quote-props */

// map WebCatalog categories to freedesktop (linux) categories
// https://github.com/webcatalog/catalog/blob/master/constants/categories.js (closed-source)
// https://specifications.freedesktop.org/menu-spec/latest/apa.html
const linuxCategories = {
  'Business': {
    freedesktopMainCategory: 'Office',
    freedesktopAdditionalCategory: '',
  },
  'Developer Tools': {
    freedesktopMainCategory: 'Development',
    freedesktopAdditionalCategory: '',
  },
  'Education': {
    freedesktopMainCategory: 'Education',
    freedesktopAdditionalCategory: '',
  },
  'Entertainment': {
    freedesktopMainCategory: 'AudioVideo',
    freedesktopAdditionalCategory: '',
  },
  'Finance': {
    freedesktopMainCategory: 'Office',
    freedesktopAdditionalCategory: 'Finance',
  },
  'Games': {
    freedesktopMainCategory: 'Game',
    freedesktopAdditionalCategory: '',
  },
  'Photography & Graphics': {
    freedesktopMainCategory: 'Graphics',
    freedesktopAdditionalCategory: 'Photography',
  },
  'Health & Fitness': {
    freedesktopMainCategory: 'Network',
    freedesktopAdditionalCategory: '',
  },
  'Lifestyle': {
    freedesktopMainCategory: 'Network',
    freedesktopAdditionalCategory: '',
  },
  'Music & Audio': {
    freedesktopMainCategory: 'AudioVideo;Audio',
    freedesktopAdditionalCategory: '',
  },
  'News & Weather': {
    freedesktopMainCategory: 'Network',
    freedesktopAdditionalCategory: 'News',
  },
  'Productivity': {
    freedesktopMainCategory: 'Office',
    freedesktopAdditionalCategory: '',
  },
  'Books & Reference': {
    freedesktopMainCategory: 'Network',
    freedesktopAdditionalCategory: '',
  },
  'Social Networking': {
    freedesktopMainCategory: 'Network',
    freedesktopAdditionalCategory: '',
  },
  'Sports': {
    freedesktopMainCategory: 'Network',
    freedesktopAdditionalCategory: '',
  },
  'Travel': {
    freedesktopMainCategory: 'Network',
    freedesktopAdditionalCategory: '',
  },
  'Utilities': {
    freedesktopMainCategory: 'Utility',
    freedesktopAdditionalCategory: '',
  },
};

module.exports = linuxCategories;
