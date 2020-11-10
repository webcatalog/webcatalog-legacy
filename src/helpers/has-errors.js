/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
const hasErrors = (form) => {
  const formKeys = Object.keys(form);
  for (let i = 0; i < formKeys.length; i += 1) {
    const currentKey = formKeys[i];
    if (currentKey.endsWith('Error') && form[currentKey]) return true;
  }
  return false;
};

export default hasErrors;
