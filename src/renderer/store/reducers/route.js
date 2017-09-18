import Immutable from 'immutable';

import { SET_SEARCH_QUERY, SET_ROUTE, GO_BACK } from '../constants/actions';

const initialState = Immutable.Map({
  routeId: 'home',
  lastRouteId: null,
});

const route = (state = initialState, action) => {
  switch (action.type) {
    case SET_ROUTE:
      return state
        .set('lastRouteId', state.get('routeId'))
        .set('routeId', action.routeId);
    case SET_SEARCH_QUERY:
    case GO_BACK:
      if (!state.get('lastRouteId')) {
        return state
          .set('routeId', 'home');
      }

      return state
        .set('lastRouteId', null)
        .set('routeId', state.get('lastRouteId'));
    default:
      return state;
  }
};

export default route;
