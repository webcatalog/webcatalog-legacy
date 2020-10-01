import { useEffect } from 'react';
import PropTypes from 'prop-types';

import connectComponent from '../../helpers/connect-component';

import amplitude from '../../amplitude';

const TelemetryManager = ({ registered }) => {
  useEffect(() => {
    amplitude.getInstance().setUserProperties({ registered });
  }, [registered]);

  // run after setUserProperties
  // https://blog.logrocket.com/post-hooks-guide-react-call-order
  useEffect(() => {
    amplitude.getInstance().logEvent('start app');
  }, []);
  return null;
};

TelemetryManager.propTypes = {
  registered: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  registered: state.preferences.registered,
});

export default connectComponent(
  TelemetryManager,
  mapStateToProps,
  null,
);
