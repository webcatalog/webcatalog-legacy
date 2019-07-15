import {
  workspacesAdd,
  workspacesSet,
  workspacesRemove,
} from './action-creators';

import { updateActivePage } from '../general/actions';

export const addWorkspace = value =>
  (dispatch, getState) => {
    dispatch(workspacesAdd(value));

    const state = getState();
    const { workspaces } = state;
    dispatch(updateActivePage('workspace', workspaces[workspaces.length - 1].id));
  };

export const setWorkspace = (index, value) =>
  (dispatch) => {
    dispatch(workspacesSet(index, value));
  };

export const removeWorkspace = index =>
  (dispatch, getState) => {
    const state = getState();

    const workspace = state.workspaces[index];
    const activeWorkspaceId = state.general.workspaceId;

    if (workspace.id === activeWorkspaceId) {
      let newActivePage = 'add-workspace';
      let newActiveWorkspaceId = null;

      if (state.workspaces.length > 1) {
        newActivePage = 'workspace';
        if (index > 0) {
          newActiveWorkspaceId = state.workspaces[index - 1].id;
        } else {
          newActiveWorkspaceId = state.workspaces[index + 1].id;
        }
      }

      dispatch(updateActivePage(newActivePage, newActiveWorkspaceId));
    }

    dispatch(workspacesRemove(index));
  };
