import { ROUTE_DIRECTORY } from '../../../constants/routes';
import {
  routeChange,
  chromeInstalledChange,
} from './action-creators';

import { isChromeInstalled } from '../../../senders/generic';
import { openSnackbar } from '../../../state/root/snackbar/actions';

import { STRING_TO_CONTINUE_INSTALL_CHROME } from '../../../constants/strings';

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

export const updateChromeInstalled = () =>
  (dispatch) => {
    const chromeInstalled = isChromeInstalled();

    dispatch(chromeInstalledChange(chromeInstalled));

    if (!chromeInstalled) {
      dispatch(openSnackbar(STRING_TO_CONTINUE_INSTALL_CHROME));
    }
  };
