import validate from '../../../helpers/validate';

import {
  dialogWorkspaceClose,
  dialogWorkspaceOpen,
  dialogWorkspaceFormUpdate,
} from './action-creators';

const getValidationRules = () => ({
  workspaceName: {
    required: true,
  },
});

export const formUpdate = changes =>
  (dispatch, getState) => {
    const validatedChanges = validate(changes, getValidationRules(getState()));
    dispatch(dialogWorkspaceFormUpdate(validatedChanges));
  };

export const close = () =>
  dispatch => dispatch(dialogWorkspaceClose());

export const open = workspaceId =>
  (dispatch, getState) => {
    const workspaces = getState().workspacesBar.workspaces;
    const workspace = workspaces.filter(w => w.workspaceId === workspaceId)[0];

    dispatch(dialogWorkspaceOpen(workspace));
  };
