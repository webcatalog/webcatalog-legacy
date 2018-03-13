import { combineReducers } from 'redux';

import {
  ACTIVATED_CHANGE,
  BROWSER_INSTALLLED_CHANGE,
} from '../../../constants/actions';

import isLicenseKeyValid from '../../../helpers/is-license-key-valid';

const browserInstalled = (state = false, action) => {
  switch (action.type) {
    case BROWSER_INSTALLLED_CHANGE: return action.browserInstalled;
    default: return state;
  }
};

const activated = (state = isLicenseKeyValid(window.localStorage.getItem('licenseKey')), action) => {
  switch (action.type) {
    case ACTIVATED_CHANGE: return action.activated;
    default: return state;
  }
};


export default combineReducers({
  activated,
  browserInstalled,
});
