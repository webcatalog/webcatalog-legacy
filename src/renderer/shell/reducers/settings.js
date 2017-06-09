import Immutable from 'immutable';

import { TOGGLE_SETTING_DIALOG, SET_BEHAVIOR } from '../constants/actions';
import defaultSettings from '../constants/defaultSettings';

const initialState = Immutable.fromJS({
  isOpen: false,
  behaviors: ipcRenderer.sendSync('get-setting', `behaviors.${window.shellInfo.id}`, defaultSettings),
});


const settings = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_SETTING_DIALOG: {
      return state.set('isOpen', !state.get('isOpen'));
    }
    case SET_BEHAVIOR: {
      return state.setIn(['behaviors', action.behaviorName], action.behaviorVal);
    }
    default:
      return state;
  }
};

export default settings;
