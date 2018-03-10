import { ROUTE_DIRECTORY } from '../../../constants/routes';
import {
  routeChange,
  browserInstalledChange,
} from './action-creators';

import { isBrowserInstalled } from '../../../senders/generic';

export const changeRoute = newRoute =>
  (dispatch, getState) => {
    const { router } = getState();
    const { route } = router;

    if (newRoute === route) return;

    dispatch(routeChange(newRoute, route));
  };

export const goBack = () =>
  (dispatch, getState) => {
    const { router } = getState();
    const { route, previousRoute } = router;

    dispatch(routeChange(previousRoute || ROUTE_DIRECTORY, route));
  };

export const updateBrowserInstalled = () =>
  (dispatch, getState) => {
    const { browser } = getState().preferences;

    const browserInstalled = isBrowserInstalled(browser);

    dispatch(browserInstalledChange(browserInstalled));
  };
