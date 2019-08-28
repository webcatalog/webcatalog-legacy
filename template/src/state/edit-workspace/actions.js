
import { UPDATE_EDIT_WORKSPACE_FORM } from '../../constants/actions';

import {
  requestSetWorkspace,
  requestSetWorkspacePicture,
  requestRemoveWorkspacePicture,
} from '../../senders';

const { remote } = window.require('electron');

export const updateForm = (changes) => (dispatch) => dispatch({
  type: UPDATE_EDIT_WORKSPACE_FORM,
  changes,
});

export const save = () => (dispatch, getState) => {
  const { form } = getState().editWorkspace;
  const id = remote.getGlobal('editWorkspaceId');

  requestSetWorkspace(
    id,
    {
      name: form.name,
      homeUrl: form.homeUrl,
    },
  );

  if (form.picturePath) {
    requestSetWorkspacePicture(id, form.picturePath);
  } else {
    requestRemoveWorkspacePicture(id);
  }

  remote.getCurrentWindow().close();
};
