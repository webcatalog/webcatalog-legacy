import {
  DIALOG_LOCK_APP_CLOSE,
  DIALOG_LOCK_APP_OPEN,
  DIALOG_LOCK_APP_FORM_UPDATE,
  DIALOG_LOCK_APP_MODE_UPDATE,
} from '../../../constants/actions';

export const dialogLockAppClose = () => ({
  type: DIALOG_LOCK_APP_CLOSE,
});

export const dialogLockAppOpen = () => ({
  type: DIALOG_LOCK_APP_OPEN,
});

export const dialogLockAppFormUpdate = changes => ({
  type: DIALOG_LOCK_APP_FORM_UPDATE,
  changes,
});

export const dialogLockAppModeUpdate = mode => ({
  type: DIALOG_LOCK_APP_MODE_UPDATE,
  mode,
});
