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
