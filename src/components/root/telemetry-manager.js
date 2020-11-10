/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect } from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../helpers/connect-component';

import amplitude from '../../amplitude';
import { getInstalledAppCount } from '../../state/app-management/utils';

const TelemetryManager = ({
  installedAppCount,
  registered,
}) => {
  useEffect(() => {
    amplitude.getInstance().setUserProperties({
      pricing: registered ? 'plus' : 'basic', // PRO plan to be added
      /* the following fields have been deprecated */
      /* do not reuse */
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
    const win = window.remote.getCurrentWindow();
    const logFocus = () => {
      amplitude.getInstance().logEvent('focus app');
    };
    win.on('focus', logFocus);
    return () => {
      win.removeListener('focus', logFocus);
    };
  }, []);
  return null;
};

TelemetryManager.propTypes = {
  installedAppCount: PropTypes.number.isRequired,
  registered: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  registered: state.preferences.registered,
  installedAppCount: state.appManagement.scanning ? -1 : getInstalledAppCount(state),
});

export default connectComponent(
  TelemetryManager,
  mapStateToProps,
  null,
);
