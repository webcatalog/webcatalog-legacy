/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
// https://stackoverflow.com/questions/21457548/why-put-ref-in-url
const generateUrlWithRef = (url) => {
  if (!url) return null;
  const urlObj = new URL(url);
  urlObj.searchParams.append('ref', 'webcatalog.app');
  return urlObj.toString();
};

export default generateUrlWithRef;
