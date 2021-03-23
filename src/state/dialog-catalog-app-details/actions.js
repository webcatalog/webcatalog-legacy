/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import {
  DIALOG_CATALOG_APP_DETAILS_CLOSE,
  DIALOG_CATALOG_APP_DETAILS_UPDATE_DETAILS,
  DIALOG_CATALOG_APP_DETAILS_OPEN,
} from '../../constants/actions';

import swiftype from '../../swiftype';

import { getRelatedPathsAsync } from '../../invokers';

export const close = () => ({
  type: DIALOG_CATALOG_APP_DETAILS_CLOSE,
});

const updateDetails = (details) => ({
  type: DIALOG_CATALOG_APP_DETAILS_UPDATE_DETAILS,
  details,
});

export const getDetailsAsync = () => async (dispatch, getState) => {
  const { appId } = getState().dialogCatalogAppDetails;
  if (!appId) return;

  const { apps } = getState().appManagement;
  const appObj = apps[appId];

  const relatedPaths = appObj ? await getRelatedPathsAsync(appObj) : null;

  if (appId.startsWith('custom-')) {
    dispatch(updateDetails({
      id: appId,
      name: appObj.name,
      url: appObj.url,
      category: null,
      description: null,
      icon: appObj.icon,
      icon256: appObj.icon,
      relatedPaths,
    }));
    return;
  }

  swiftype
    .search('', {
      filters: {
        id: [appId],
      },
      result_fields: {
        id: { raw: {} },
        name: { raw: {} },
        url: { raw: {} },
        category: { raw: {} },
        description: { raw: {} },
        widevine: { raw: {} },
        icon: window.process.platform === 'win32' ? undefined : { raw: {} },
        icon_256: window.process.platform === 'win32' ? undefined : { raw: {} },
        icon_unplated: window.process.platform === 'win32' ? { raw: {} } : undefined,
        icon_unplated_256: window.process.platform === 'win32' ? { raw: {} } : undefined,
      },
    })
    .then((res) => {
      const app = res.rawResults[0];
      dispatch(updateDetails({
        id: app.id.raw,
        name: app.name.raw,
        url: app.url.raw,
        category: app.category.raw,
        description: app.description.raw,
        widevine: app.widevine.raw === 1,
        icon: window.process.platform === 'win32' // use unplated icon for Windows
          ? app.icon_unplated.raw : app.icon.raw,
        icon256: window.process.platform === 'win32' // use unplated icon for Windows
          ? app.icon_unplated_256.raw : app.icon_256.raw,
        relatedPaths,
      }));
    })
    .catch((err) => {
      dispatch(updateDetails({
        err,
      }));
    });
};

export const open = (appId) => (dispatch) => {
  dispatch(({
    type: DIALOG_CATALOG_APP_DETAILS_OPEN,
    appId,
  }));

  dispatch(getDetailsAsync());
};
