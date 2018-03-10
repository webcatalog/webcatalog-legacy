import {
  localAppSet,
  localAppRemove,
} from './action-creators';

import { openSnackbar } from '../snackbar/actions';

import installAppAsync from '../../../helpers/install-app-async';

import {
  STRING_FAILED_TO_INSTALL,
  STRING_NAME_EXISTS,
} from '../../../constants/strings';

import { nameExists } from './utils';


export const setLocalApp = (id, status, app) =>
  dispatch => dispatch(localAppSet(id, status, app));

export const removeLocalApp = id =>
  dispatch => dispatch(localAppRemove(id));


export const installApp = app =>
  (dispatch, getState) => {
    const state = getState();

    const { browser } = state.preferences;

    if (nameExists(state, app.name)) {
      dispatch(openSnackbar(STRING_NAME_EXISTS.replace('{name}', app.name)));
      return null;
    }

    return installAppAsync(app, browser)
      .catch((err) => {
        dispatch(openSnackbar(STRING_FAILED_TO_INSTALL.replace('{name}', app.name)));
        // eslint-disable-next-line
        console.log(err);
      });
  };
