import {
  DIALOG_PREFERENCES_CLOSE,
  DIALOG_PREFERENCES_OPEN,
} from '../../../constants/actions';

export const dialogPreferencesClose = () => ({
  type: DIALOG_PREFERENCES_CLOSE,
});

export const dialogPreferencesOpen = () => ({
  type: DIALOG_PREFERENCES_OPEN,
});
