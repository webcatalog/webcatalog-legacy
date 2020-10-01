import amplitude from 'amplitude-js';
import { v5 as uuidv5 } from 'uuid';

amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);
amplitude.getInstance().setOptOut(window.optOutTelemetry);

// custom device id to unify uniques between webcatalog-app & webcatalog-engine
if (window.machineId) {
  // share namespace between webcatalog-app & webcatalog-engine
  const DEVICE_ID_NAMESPACE = '4b7e2725-dced-4244-b5f5-2221316d272c';
  const deviceId = uuidv5(window.machineId, DEVICE_ID_NAMESPACE);
  amplitude.getInstance().setDeviceId(deviceId);
}

export default amplitude;
