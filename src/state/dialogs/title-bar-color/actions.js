import { requestSetPreference } from '../../../senders/preferences';

import { open as openDialogRelaunch } from '../relaunch/actions';

import {
  dialogTitleBarColorClose,
  dialogTitleBarColorOpen,
  dialogTitleBarColorFormUpdate,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogTitleBarColorClose());

export const open = () =>
  (dispatch, getState) => {
    dispatch(dialogTitleBarColorOpen());
    dispatch(dialogTitleBarColorFormUpdate({
      content: getState().preferences.titleBarColor,
    }));
  };

export const formUpdate = changes =>
  dispatch => dispatch(dialogTitleBarColorFormUpdate(changes));

export const save = () => (dispatch, getState) => {
  const { content } = getState().dialogs.titleBarColor.form;
  requestSetPreference('titleBarColor', content);
  dispatch(close());
  dispatch(openDialogRelaunch());
};
