import { requestSetPreference } from '../../../senders/preferences';

import { open as openDialogRelaunch } from '../relaunch/actions';

import {
  dialogInjectJSClose,
  dialogInjectJSOpen,
  dialogInjectJSFormUpdate,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogInjectJSClose());

export const open = () =>
  (dispatch, getState) => {
    dispatch(dialogInjectJSOpen());
    dispatch(dialogInjectJSFormUpdate({
      content: getState().preferences.injectJS,
    }));
  };

export const formUpdate = changes =>
  dispatch => dispatch(dialogInjectJSFormUpdate(changes));

export const save = () => (dispatch, getState) => {
  const { content } = getState().dialogs.injectJS.form;
  requestSetPreference('injectJS', content);
  dispatch(close());
  dispatch(openDialogRelaunch());
};
