/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import * as Comlink from 'comlink';

async function filterApps(apps, sortedAppIds, query) {
  const processedQuery = query.trim().toLowerCase();
  return sortedAppIds.filter((id) => {
    const app = apps[id];
    return (
      app.name.toLowerCase().includes(processedQuery)
      || (app.url && app.url.toLowerCase().includes(processedQuery))
    );
  });
}

Comlink.expose(filterApps);
