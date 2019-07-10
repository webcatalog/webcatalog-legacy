import { requestSetPreference } from '../../../senders/preferences';

import { open as openDialogRelaunch } from '../relaunch/actions';

import {
  dialogInjectCSSClose,
  dialogInjectCSSOpen,
  dialogInjectCSSFormUpdate,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogInjectCSSClose());

export const open = () =>
  (dispatch, getState) => {
    dispatch(dialogInjectCSSOpen());
    dispatch(dialogInjectCSSFormUpdate({
      content: getState().preferences.injectCSS,
    }));
  };

export const formUpdate = changes =>
  dispatch => dispatch(dialogInjectCSSFormUpdate(changes));

export const save = () => (dispatch, getState) => {
  const { content } = getState().dialogs.injectCSS.form;
  requestSetPreference('injectCSS', content);
  dispatch(close());
  dispatch(openDialogRelaunch());
};
