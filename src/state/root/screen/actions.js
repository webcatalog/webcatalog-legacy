import { SCREEN_RESIZE } from '../../../constants/actions';

/* eslint-disable import/prefer-default-export */
export const screenResize = screenWidth => ({
  type: SCREEN_RESIZE,
  screenWidth,
});
