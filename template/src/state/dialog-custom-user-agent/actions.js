
import { UPDATE_CUSTOM_USER_AGENT_FORM } from '../../constants/actions';
import {
  getPreference,
  requestSetPreference,
  requestShowRequireRestartDialog,
} from '../../senders';


export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_CUSTOM_USER_AGENT_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().dialogCustomUserAgent;

  if (getPreference('customUserAgent') !== form.code) {
    requestSetPreference('customUserAgent', form.code);
    requestShowRequireRestartDialog();
  }

  window.require('electron').remote.getCurrentWindow().close();
};
