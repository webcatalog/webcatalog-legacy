/* global path remote */

import {
  TOGGLE_CUSTOM_DIALOG, SET_CUSTOM_VALUE, SET_CUSTOM_STATUS, ADD_APP_STATUS, DONE,
  FAILED, LOADING, INSTALLED,
} from '../constants/actions';

import getAllAppPath from '../helpers/getAllAppPath';
import installAppAsync from '../helpers/installAppAsync';

export const toggleCustomDialog = () => ({
  type: TOGGLE_CUSTOM_DIALOG,
});

export const setCustomValue = (fieldName, fieldVal) => ({
  type: SET_CUSTOM_VALUE,
  fieldName,
  fieldVal,
});

export const setCustomStatus = status => ({
  type: SET_CUSTOM_STATUS,
  status,
});

export const installCustomApp = () => (dispatch, getState) => {
  dispatch(setCustomStatus(LOADING));

  const custom = getState().custom;
  const name = custom.get('name');
  const url = custom.get('url');
  const icon = custom.get('icon');

  const id = `custom-${new Date().getTime().toString()}`;

  installAppAsync({
    allAppPath: getAllAppPath(),
    appId: id,
    appName: name,
    appUrl: url,
    pngPath: icon || path.join(remote.app.getAppPath(), 'app', 'www', 'images', 'custom_app.png').replace('app.asar', 'app.asar.unpacked'),
  })
  .then(() => {
    dispatch(setCustomValue('id', id));
    dispatch(setCustomStatus(DONE));
    dispatch({
      type: ADD_APP_STATUS,
      id,
      status: INSTALLED,
    });
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    dispatch(setCustomStatus(FAILED));
  });
};
