/* global path remote */

import {
  TOGGLE_CUSTOM_DIALOG, SET_CUSTOM_VALUE, SET_CUSTOM_STATUS,
  DONE, FAILED, LOADING,
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

  const { name, url, icon } = getState().custom;
  const id = new Date().getTime().toString();

  installAppAsync({
    allAppPath: getAllAppPath(),
    appId: id,
    appName: name,
    appUrl: url,
    pngPath: icon || path.join(remote.app.getAppPath(), 'www', 'images', 'custom_app.png').replace('app.asar', 'app.asar.unpacked'),
  })
  .then(() => {
    dispatch(setCustomValue('id', id));
    dispatch(setCustomStatus(DONE));
  })
  .catch((err) => {
    /* eslint-disable no-console */
    console.log(err);
    /* eslint-enable no-console */
    dispatch(setCustomStatus(FAILED));
  });
};
