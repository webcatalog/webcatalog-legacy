import {
  DIALOG_RESET_CLOSE,
  DIALOG_RESET_OPEN,
} from '../../../constants/actions';

export const dialogResetClose = () => ({
  type: DIALOG_RESET_CLOSE,
});

export const dialogResetOpen = () => ({
  type: DIALOG_RESET_OPEN,
});
