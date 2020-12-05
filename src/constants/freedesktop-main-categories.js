/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

// https://specifications.freedesktop.org/menu-spec/latest/apa.html

// scrape with following code
// const table = document.querySelector('div.informaltable')
// [...table.querySelectorAll('tbody > tr')].map((node) => node.querySelector('td').innerText);
const freedesktopMainCategories = [
  'AudioVideo',
  'AudioVideo;Audio',
  'AudioVideo;Video',
  'Development',
  'Education',
  'Game',
  'Graphics',
  'Network',
  'Office',
  'Science',
  'Settings',
  'System',
  'Utility',
];

export default freedesktopMainCategories;
