import { combineReducers } from 'redux';

import {
  ACTIVATED_CHANGE,
  ACTIVE_PAGE_CHANGE,
} from '../../../constants/actions';

import isLicenseKeyValid from '../../../helpers/is-license-key-valid';

import { getWorkspaces } from '../../../senders/workspaces';

const activated = (state = isLicenseKeyValid(window.localStorage.getItem('licenseKey')), action) => {
  switch (action.type) {
    case ACTIVATED_CHANGE: return action.activated;
    default: return state;
  }
};

const workspaces = getWorkspaces();

const activePage = (state = workspaces.length > 0 ? 'workspace' : 'add-workspace', action) => {
  switch (action.type) {
    case ACTIVE_PAGE_CHANGE: return action.activePage;
    default: return state;
  }
};

const workspaceId = (state = workspaces.length > 0 ? workspaces[0].id : null, action) => {
  switch (action.type) {
    case ACTIVE_PAGE_CHANGE: return action.workspaceId;
    default: return state;
  }
};

export default combineReducers({
  activated,
  activePage,
  workspaceId,
});
