/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable quote-props */

// map WebCatalog categories to freedesktop (linux) categories
// https://github.com/webcatalog/catalog/blob/master/constants/categories.js (closed-source)
// https://specifications.freedesktop.org/menu-spec/latest/apa.html
const linuxCategories = {
  'Business': 'Office',
  'Developer Tools': 'Development',
  'Education': 'Education',
  'Entertainment': 'AudioVideo',
  'Finance': 'Office;Finance',
  'Games': 'Game',
  'Photography & Graphics': 'Graphics;Photography',
  'Health & Fitness': 'Network',
  'Lifestyle': 'Network',
  'Music & Audio': 'AudioVideo;Audio',
  'News & Weather': 'Network',
  'Productivity': 'Office',
  'Books & Reference': 'Network',
  'Social Networking': 'Network',
  'Sports': 'Network',
  'Travel': 'Network',
  'Utilities': 'Utility',
};

module.exports = linuxCategories;
