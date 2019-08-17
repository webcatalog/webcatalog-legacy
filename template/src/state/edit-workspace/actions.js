
import { UPDATE_EDIT_WORKSPACE_FORM } from '../../constants/actions';

import { requestSetWorkspace } from '../../senders';

const { remote } = window.require('electron');

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_EDIT_WORKSPACE_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().editWorkspace;

  requestSetWorkspace(
    remote.getGlobal('editWorkspaceId'),
    {
      name: form.name,
      homeUrl: form.homeUrl,
    },
  );

  remote.getCurrentWindow().close();
};
