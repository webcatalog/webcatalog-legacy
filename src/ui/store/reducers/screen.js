import { remote } from 'electron';
import Immutable from 'immutable';

import { SCREEN_RESIZE } from '../constants/actions';

const initialState = Immutable.Map({
  isFullScreen: remote.getCurrentWindow().isFullScreen(),
  isMaximized: remote.getCurrentWindow().isMaximized(),
  isMinimized: remote.getCurrentWindow().isMinimized(),
  screenWidth: typeof window === 'object' ? window.innerWidth : null,
});

const screen = (state = initialState, action) => {
  switch (action.type) {
    case SCREEN_RESIZE:
      return state
        .set('screenWidth', action.screenWidth)
        .set('isFullScreen', action.isFullScreen)
        .set('isMaximized', action.isMaximized)
        .set('isMinimized', action.isMinimized);
    default:
      return state;
  }
};

export default screen;
