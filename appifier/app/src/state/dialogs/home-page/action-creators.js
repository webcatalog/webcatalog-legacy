import {
  DIALOG_HOME_PAGE_CLOSE,
  DIALOG_HOME_PAGE_OPEN,
  DIALOG_HOME_PAGE_FORM_UPDATE,
} from '../../../constants/actions';

export const dialogHomePageClose = () => ({
  type: DIALOG_HOME_PAGE_CLOSE,
});

export const dialogHomePageOpen = () => ({
  type: DIALOG_HOME_PAGE_OPEN,
});

export const dialogHomePageFormUpdate = changes => ({
  type: DIALOG_HOME_PAGE_FORM_UPDATE,
  changes,
});
