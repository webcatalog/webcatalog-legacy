import { requestSetPreference } from '../../../senders/preferences';

import { open as openDialogRelaunch } from '../relaunch/actions';

import {
  dialogUserAgentClose,
  dialogUserAgentOpen,
  dialogUserAgentFormUpdate,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogUserAgentClose());

export const open = () =>
  (dispatch, getState) => {
    dispatch(dialogUserAgentOpen());
    dispatch(dialogUserAgentFormUpdate({
      content: getState().preferences.userAgent,
    }));
  };

export const formUpdate = changes =>
  dispatch => dispatch(dialogUserAgentFormUpdate(changes));

export const save = () => (dispatch, getState) => {
  const { content } = getState().dialogs.userAgent.form;
  requestSetPreference('userAgent', content);
  dispatch(close());
  dispatch(openDialogRelaunch());
};
