import { remote } from 'electron';
import camelCase from 'lodash.camelcase';

import { TOGGLE_SETTING_DIALOG, SET_BEHAVIOR, SET_BEHAVIORS } from '../constants/actions';
import defaultSettings from '../constants/defaultSettings';

const appInfo = remote.getCurrentWindow().appInfo;

export const toggleSettingDialog = () => ({
  type: TOGGLE_SETTING_DIALOG,
});

export const setBehavior = (name, val) => (dispatch) => {
  dispatch({
    type: SET_BEHAVIOR,
    behaviorName: name,
    behaviorVal: val,
  });

  const electronSettings = remote.require('electron-settings');
  electronSettings.set(`behaviors.${camelCase(appInfo.id)}.${name}`, val);
};

export const getBehaviors = () => (dispatch) => {
  const electronSettings = remote.require('electron-settings');
  const behaviors = electronSettings.get(`behaviors.${camelCase(appInfo.id)}`, defaultSettings);

  dispatch({
    type: SET_BEHAVIORS,
    behaviors,
  });
};
