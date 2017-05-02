import { SCREEN_RESIZE } from '../constants/actions';

export const screenResize = ({ screenWidth }) => ({
  type: SCREEN_RESIZE,
  screenWidth,
});
