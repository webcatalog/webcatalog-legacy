import { appsIndex } from '../../algolia';

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
  appsIndex.getObject(appId)
    .then((details) => {
      dispatch(updateDetails(details));
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
