import { combineReducers } from 'redux';

import { UPDATE_EDIT_WORKSPACE_FORM } from '../../constants/actions';

import { getWorkspace } from '../../senders';

const workspaceId = window.require('electron').remote.getGlobal('editWorkspaceId');
const defaultForm = {
  name: workspaceId ? getWorkspace(workspaceId).name : '',
};

const form = (state = defaultForm, action) => {
  switch (action.type) {
    case UPDATE_EDIT_WORKSPACE_FORM: return Object.assign({}, state, action.changes);
    default: return state;
  }
};

export default combineReducers({ form });
