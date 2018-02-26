import { SCREEN_RESIZE } from '../../../constants/actions';

import { isFullScreen } from '../../../senders/generic';

const initialState = {
  screenWidth: typeof window === 'object' ? window.innerWidth : null,
  isFullScreen: isFullScreen(),
};

const screen = (state = initialState, action) => {
  switch (action.type) {
    case SCREEN_RESIZE:
      return Object.assign({}, state, {
        screenWidth: action.screenWidth,
        isFullScreen: isFullScreen(),
      });
    default:
      return state;
  }
};

export default screen;
