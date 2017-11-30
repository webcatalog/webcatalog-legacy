import {
  DIALOG_CONFIRM_UNINSTALL_APP_CLOSE,
  DIALOG_CONFIRM_UNINSTALL_APP_OPEN,
  DIALOG_CONFIRM_UNINSTALL_APP_SAVE_REQUEST,
  DIALOG_CONFIRM_UNINSTALL_APP_SAVE_SUCCESS,
} from '../../../constants/actions';

export const dialogConfirmUninstallAppClose = () => ({
  type: DIALOG_CONFIRM_UNINSTALL_APP_CLOSE,
});

export const dialogConfirmUninstallAppOpen = form => ({
  type: DIALOG_CONFIRM_UNINSTALL_APP_OPEN,
  form,
});

export const dialogConfirmUninstallAppSaveRequest = () => ({
  type: DIALOG_CONFIRM_UNINSTALL_APP_SAVE_REQUEST,
});

export const dialogConfirmUninstallAppSaveSuccess = () => ({
  type: DIALOG_CONFIRM_UNINSTALL_APP_SAVE_SUCCESS,
});
