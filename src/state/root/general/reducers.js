import { combineReducers } from 'redux';

import { ACTIVATED_CHANGE } from '../../../constants/actions';

import isLicenseKeyValid from '../../../helpers/is-license-key-valid';

const activated = (state = isLicenseKeyValid(window.localStorage.getItem('licenseKey')), action) => {
  switch (action.type) {
    case ACTIVATED_CHANGE: return action.activated;
    default: return state;
  }
};


export default combineReducers({
  activated,
});
