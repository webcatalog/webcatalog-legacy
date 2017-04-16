import { SCREEN_RESIZE } from '../constants/actions';

export const screenResize = ({ screenWidth, isFullScreen, isMaximized, isMinimized }) => ({
  type: SCREEN_RESIZE,
  screenWidth,
  isFullScreen,
  isMaximized,
  isMinimized,
});
