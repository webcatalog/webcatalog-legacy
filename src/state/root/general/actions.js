import {
  activatedChange,
  browserInstalledChange,
} from './action-creators';

import { isBrowserInstalled } from '../../../senders/generic';

export const updateBrowserInstalled = () =>
  (dispatch, getState) => {
    const { browser } = getState().preferences;

    const browserInstalled = isBrowserInstalled(browser);

    dispatch(browserInstalledChange(browserInstalled));
  };

export const updateActivated = activated =>
  (dispatch) => {
    dispatch(activatedChange(activated));
  };
