import { SCREEN_RESIZE } from '../constants/actions';

export const screenResize = (screenWidth, isFullScreen) => ({
  type: SCREEN_RESIZE,
  screenWidth,
  isFullScreen,
});
