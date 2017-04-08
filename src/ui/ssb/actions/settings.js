/* global electronSettings argv */
import camelCase from 'lodash.camelcase';

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

  electronSettings.set(`behaviors.${camelCase(argv.id)}.${name}`, val)
    /* eslint-disable no-console */
    .catch(console.log);
    /* eslint-enab le no-console */
};

export const getBehaviors = () => (dispatch) => {
  const behaviors = electronSettings.get(`behaviors.${camelCase(argv.id)}`, defaultSettings);

  dispatch({
    type: SET_BEHAVIORS,
    behaviors,
  });
};
