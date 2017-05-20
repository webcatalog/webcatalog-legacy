import { ipcRenderer } from 'electron';

import { TOGGLE_SETTING_DIALOG, SET_BEHAVIOR, SET_BEHAVIORS } from '../constants/actions';
import defaultSettings from '../constants/defaultSettings';

export const toggleSettingDialog = () => ({
  type: TOGGLE_SETTING_DIALOG,
});

export const setBehavior = (name, val) => (dispatch) => {
  dispatch({
    type: SET_BEHAVIOR,
    behaviorName: name,
    behaviorVal: val,
  });

  ipcRenderer.send('set-setting', `behaviors.${window.shellInfo.id}.${name}`, val);
};

export const getBehaviors = () => (dispatch) => {
  const behaviors = ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}`, defaultSettings);
  dispatch({
    type: SET_BEHAVIORS,
    behaviors,
  });
};
