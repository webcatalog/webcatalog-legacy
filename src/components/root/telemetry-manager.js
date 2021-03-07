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
  telemetry,
}) => {
  useEffect(() => {
    amplitude.getInstance().setOptOut(!telemetry);
  }, [telemetry]);

  useEffect(() => {
    amplitude.getInstance().setUserProperties({
      /* the following fields have been deprecated */
      /* do not reuse */
      // pricingPlan: registered ? 'plus' : 'basic', // PRO plan to be added
      // registered, // legacy
    });
  }, []);

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
    window.ipcRenderer.on('log-focus', logFocus);
    return () => {
      window.ipcRenderer.removeListener('log-focus', logFocus);
    };
  }, []);
  return null;
};

TelemetryManager.defaultProps = {
  telemetry: false,
};

TelemetryManager.propTypes = {
  installedAppCount: PropTypes.number.isRequired,
  telemetry: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  installedAppCount: state.appManagement.scanning ? -1 : getInstalledAppCount(state),
  telemetry: state.preferences.telemetry,
});

export default connectComponent(
  TelemetryManager,
  mapStateToProps,
  null,
);
