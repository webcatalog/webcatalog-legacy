/* global electronSettings argv */
import camelCase from 'lodash.camelcase';

import { TOGGLE_SETTING_DIALOG, SET_BEHAVIOR, SET_BEHAVIORS } from '../constants/actions';

export const toggleSettingDialog = () => ({
  type: TOGGLE_SETTING_DIALOG,
});

export const setBehavior = (name, val) => (dispatch) => {
  electronSettings.set(`behaviors.${camelCase(argv.id)}.${name}`, val)
    .then(() => {
      dispatch({
        type: SET_BEHAVIOR,
        behaviorName: name,
        behaviorVal: val,
      });
    })
    /* eslint-disable no-console */
    .catch(console.log);
    /* eslint-enab le no-console */
};

export const getBehaviors = () => (dispatch) => {
  electronSettings.get(`behaviors.${camelCase(argv.id)}`)
    .then((behaviors) => {
      dispatch({
        type: SET_BEHAVIORS,
        behaviors,
      });
    })
    /* eslint-disable no-console */
    .catch(console.log);
    /* eslint-enab le no-console */
};
