import amplitude from 'amplitude-js';

amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);
amplitude.getInstance().setOptOut(window.optOutTelemetry);

export default amplitude;
