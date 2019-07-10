import {
  DIALOG_WORKSPACE_FORM_UPDATE,
  DIALOG_WORKSPACE_CLOSE,
  DIALOG_WORKSPACE_OPEN,
} from '../../../constants/actions';

export const dialogWorkspaceFormUpdate = changes => ({
  type: DIALOG_WORKSPACE_FORM_UPDATE,
  changes,
});

export const dialogWorkspaceClose = () => ({
  type: DIALOG_WORKSPACE_CLOSE,
});

export const dialogWorkspaceOpen = workspace => ({
  type: DIALOG_WORKSPACE_OPEN,
  workspace,
});
