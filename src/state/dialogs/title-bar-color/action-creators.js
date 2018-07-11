import {
  DIALOG_TITLE_BAR_COLOR_CLOSE,
  DIALOG_TITLE_BAR_COLOR_OPEN,
  DIALOG_TITLE_BAR_COLOR_FORM_UPDATE,
} from '../../../constants/actions';

export const dialogTitleBarColorClose = () => ({
  type: DIALOG_TITLE_BAR_COLOR_CLOSE,
});

export const dialogTitleBarColorOpen = () => ({
  type: DIALOG_TITLE_BAR_COLOR_OPEN,
});

export const dialogTitleBarColorFormUpdate = changes => ({
  type: DIALOG_TITLE_BAR_COLOR_FORM_UPDATE,
  changes,
});
