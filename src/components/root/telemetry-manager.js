/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';

import amplitude from '../../amplitude';
import { getInstalledAppCount } from '../../state/app-management/utils';

const TelemetryManager = () => {
  const registered = useSelector((state) => state.preferences.registered);
  const installedAppCount = useSelector((state) => {
    if (state.appManagement.scanning) return -1;
    return getInstalledAppCount(state);
  });
  const telemetry = useSelector((state) => state.preferences.telemetry);

  useEffect(() => {
    amplitude.getInstance().setOptOut(!telemetry);
  }, [telemetry]);

  useEffect(() => {
    amplitude.getInstance().setUserProperties({
      plan: registered ? 'lifetime' : 'basic', // PRO plan to be added
      /* the following fields have been deprecated */
      /* do not reuse */
      // pricing: registered ? 'plus' : 'basic', // PRO plan to be added
      // pricingPlan: registered ? 'plus' : 'basic', // PRO plan to be added
      // registered, // legacy
    });
  }, [registered]);

  useEffect(() => {
    if (installedAppCount >= 0) {
      amplitude.getInstance().setUserProperties({ installedAppCount });
    }
  }, [installedAppCount]);

  // run after setUserProperties
  // https://blog.logrocket.com/post-hooks-guide-react-call-order
  useEffect(() => {
    amplitude.getInstance().logEvent('start app');

    // this is important to track usage correctly
    // if not, we will miss usage data when users keep the app open and switch back later
    // instead of quitting and restarting the app
    const logFocus = () => {
      amplitude.getInstance().logEvent('focus app');
    };
    ipcRenderer.on('log-focus', logFocus);
    return () => {
      ipcRenderer.removeListener('log-focus', logFocus);
    };
  }, []);
  return null;
};

export default TelemetryManager;
