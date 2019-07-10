import { requestSetPreference } from '../../../senders/preferences';

import { open as openDialogRelaunch } from '../relaunch/actions';

import {
  dialogProxyRulesClose,
  dialogProxyRulesOpen,
  dialogProxyRulesFormUpdate,
} from './action-creators';

export const close = () =>
  dispatch => dispatch(dialogProxyRulesClose());

export const open = () =>
  (dispatch, getState) => {
    dispatch(dialogProxyRulesOpen());
    dispatch(dialogProxyRulesFormUpdate({
      content: getState().preferences.proxyRules,
    }));
  };

export const formUpdate = changes =>
  dispatch => dispatch(dialogProxyRulesFormUpdate(changes));

export const save = () => (dispatch, getState) => {
  const { content } = getState().dialogs.proxyRules.form;
  requestSetPreference('proxyRules', content);
  dispatch(close());
  dispatch(openDialogRelaunch());
};
