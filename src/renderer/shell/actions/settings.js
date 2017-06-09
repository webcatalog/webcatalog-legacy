import { TOGGLE_SETTING_DIALOG, SET_BEHAVIOR } from '../constants/actions';

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
