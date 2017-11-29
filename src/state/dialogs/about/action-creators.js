import {
  DIALOG_ABOUT_CLOSE,
  DIALOG_ABOUT_OPEN,
} from '../../../constants/actions';

export const dialogAboutClose = () => ({
  type: DIALOG_ABOUT_CLOSE,
});

export const dialogAboutOpen = () => ({
  type: DIALOG_ABOUT_OPEN,
});
