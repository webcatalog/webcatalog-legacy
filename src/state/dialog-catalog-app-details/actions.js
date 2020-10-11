import * as ElasticAppSearch from '@elastic/app-search-javascript';

import {
  DIALOG_CATALOG_APP_DETAILS_CLOSE,
  DIALOG_CATALOG_APP_DETAILS_UPDATE_DETAILS,
  DIALOG_CATALOG_APP_DETAILS_OPEN,
} from '../../constants/actions';

export const close = () => ({
  type: DIALOG_CATALOG_APP_DETAILS_CLOSE,
});

const updateDetails = (details) => ({
  type: DIALOG_CATALOG_APP_DETAILS_UPDATE_DETAILS,
  details,
});

export const getDetailsAsync = () => (dispatch, getState) => {
  const { appId } = getState().dialogCatalogAppDetails;
  if (!appId) return;

  const client = ElasticAppSearch.createClient({
    searchKey: process.env.REACT_APP_SWIFTYPE_SEARCH_KEY,
    engineName: process.env.REACT_APP_SWIFTYPE_ENGINE_NAME,
    hostIdentifier: process.env.REACT_APP_SWIFTYPE_HOST_ID,
  });

  client
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
        icon: window.process.platform === 'win32' // use unplated icon for Windows
          ? app.icon_unplated.raw : app.icon.raw,
        icon256: window.process.platform === 'win32' // use unplated icon for Windows
          ? app.icon_unplated_256.raw : app.icon_256.raw,
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
