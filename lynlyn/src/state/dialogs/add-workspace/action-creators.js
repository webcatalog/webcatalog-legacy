import {
  DIALOG_ADD_WORKSPACE_CLOSE,
  DIALOG_ADD_WORKSPACE_FORM_UPDATE,
  DIALOG_ADD_WORKSPACE_OPEN,
} from '../../../constants/actions';

export const addWorkspaceClose = () => ({
  type: DIALOG_ADD_WORKSPACE_CLOSE,
});

export const addWorkspaceOpen = () => ({
  type: DIALOG_ADD_WORKSPACE_OPEN,
});

export const addWorkspaceFormUpdate = changes => ({
  type: DIALOG_ADD_WORKSPACE_FORM_UPDATE,
  changes,
});
