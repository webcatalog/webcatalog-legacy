import { remote } from 'electron';
import Immutable from 'immutable';

import { SCREEN_RESIZE } from '../constants/actions';

const initialState = Immutable.Map({
  isFullScreen: remote.getCurrentWindow().isFullScreen(),
  screenWidth: typeof window === 'object' ? window.innerWidth : null,
});

const screen = (state = initialState, action) => {
  switch (action.type) {
    case SCREEN_RESIZE:
      return state.set('screenWidth', action.screenWidth).set('isFullScreen', action.isFullScreen);
    default:
      return state;
  }
};

export default screen;
