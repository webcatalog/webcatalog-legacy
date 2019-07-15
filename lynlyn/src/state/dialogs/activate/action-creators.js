import {
  DIALOG_ACTIVATE_CLOSE,
  DIALOG_ACTIVATE_OPEN,
  DIALOG_ACTIVATE_FORM_UPDATE,
} from '../../../constants/actions';

export const dialogActivateClose = () => ({
  type: DIALOG_ACTIVATE_CLOSE,
});

export const dialogActivateOpen = () => ({
  type: DIALOG_ACTIVATE_OPEN,
});

export const dialogActivateFormUpdate = changes => ({
  type: DIALOG_ACTIVATE_FORM_UPDATE,
  changes,
});
