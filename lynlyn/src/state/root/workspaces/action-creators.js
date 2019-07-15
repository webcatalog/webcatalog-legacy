import {
  WORKSPACES_ADD,
  WORKSPACES_SET,
  WORKSPACES_REMOVE,
} from '../../../constants/actions';

export const workspacesAdd = value => ({
  type: WORKSPACES_ADD,
  value,
});

export const workspacesSet = (index, value) => ({
  type: WORKSPACES_SET,
  index,
  value,
});

export const workspacesRemove = index => ({
  type: WORKSPACES_REMOVE,
  index,
});
