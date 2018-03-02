import { requestSetPreference } from '../../../senders/preferences';

import {
  dialogHomePageClose,
  dialogHomePageOpen,
  dialogHomePageFormUpdate,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogHomePageClose());

export const open = () =>
  (dispatch, getState) => {
    dispatch(dialogHomePageOpen());
    dispatch(dialogHomePageFormUpdate({
      content: getState().preferences.homePage || window.shellInfo.url,
    }));
  };

export const formUpdate = changes =>
  dispatch => dispatch(dialogHomePageFormUpdate(changes));

export const resetToDefault = () => (dispatch) => {
  requestSetPreference('homePage', null);
  dispatch(close());
};

export const save = () => (dispatch, getState) => {
  const { content } = getState().dialogs.homePage.form;
  requestSetPreference('homePage', content);
  dispatch(close());
};
