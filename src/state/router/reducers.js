/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { combineReducers } from 'redux';

import {
  ROUTE_HOME,
  ROUTE_INSTALLED,
  ROUTE_SPACES,
  ROUTE_PREFERENCES,
} from '../../constants/routes';

import { CHANGE_ROUTE } from '../../constants/actions';

import { getPreference } from '../../senders';

let defaultRoute;
switch (getPreference('defaultHome')) {
  case 'spaces': {
    defaultRoute = ROUTE_SPACES;
    break;
  }
  case 'installed': {
    defaultRoute = ROUTE_INSTALLED;
    break;
  }
  case 'preferences': {
    defaultRoute = ROUTE_PREFERENCES;
    break;
  }
  default: {
    defaultRoute = ROUTE_HOME;
  }
}

const route = (state = defaultRoute, action) => {
  switch (action.type) {
    case CHANGE_ROUTE: return action.route;
    default: return state;
  }
};

export default combineReducers({
  route,
});
