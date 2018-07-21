import {
  DIALOG_PREFERENCES_LOCK_CLOSE,
  DIALOG_PREFERENCES_LOCK_OPEN,
  DIALOG_PREFERENCES_LOCK_FORM_UPDATE,
} from '../../../constants/actions';

export const dialogPreferencesLockClose = () => ({
  type: DIALOG_PREFERENCES_LOCK_CLOSE,
});

export const dialogPreferencesLockOpen = () => ({
  type: DIALOG_PREFERENCES_LOCK_OPEN,
});

export const dialogPreferencesLockFormUpdate = changes => ({
  type: DIALOG_PREFERENCES_LOCK_FORM_UPDATE,
  changes,
});
