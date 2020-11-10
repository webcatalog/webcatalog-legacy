/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
export const trackInstallAsync = (deviceId, appId) => {
  const url = new URL('https://functions.webcatalog.app/track-install');
  url.searchParams.append('deviceId', deviceId);
  url.searchParams.append('appId', appId);

  return window.fetch(url)
    // eslint-disable-next-line no-console
    .catch((err) => console.log(err));
};
