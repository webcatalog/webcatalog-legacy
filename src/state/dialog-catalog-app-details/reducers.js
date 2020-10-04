import { combineReducers } from 'redux';

import {
  DIALOG_CATALOG_APP_DETAILS_CLOSE,
  DIALOG_CATALOG_APP_DETAILS_UPDATE_DETAILS,
  DIALOG_CATALOG_APP_DETAILS_OPEN,
} from '../../constants/actions';

const open = (state = false, action) => {
  switch (action.type) {
    case DIALOG_CATALOG_APP_DETAILS_CLOSE: return false;
    case DIALOG_CATALOG_APP_DETAILS_OPEN: return true;
    default: return state;
  }
};

const appId = (state = null, action) => {
  switch (action.type) {
    case DIALOG_CATALOG_APP_DETAILS_CLOSE: return null;
    case DIALOG_CATALOG_APP_DETAILS_OPEN: return action.appId;
    default: return state;
  }
};

const details = (state = null, action) => {
  switch (action.type) {
    case DIALOG_CATALOG_APP_DETAILS_OPEN: return null;
    case DIALOG_CATALOG_APP_DETAILS_UPDATE_DETAILS: return action.details;
    default: return state;
  }
};

export default combineReducers({ open, appId, details });
