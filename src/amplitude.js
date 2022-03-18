/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import amplitude from 'amplitude-js';
import { v5 as uuidv5 } from 'uuid';
import { app } from '@electron/remote';
import { captureException } from '@sentry/electron/renderer';

import { getMachineIdAsync } from './invokers';

amplitude.getInstance().init(process.env.REACT_APP_AMPLITUDE_API_KEY);
amplitude.getInstance().setVersionName(app.getVersion());
// opt out by default
// we sync this with user pref in TelemetryManager
amplitude.getInstance().setOptOut(true);

// custom device id to unify uniques between webcatalog-app & webcatalog-engine
getMachineIdAsync()
  .then((machineId) => {
    // share namespace between webcatalog-app & webcatalog-engine
    const DEVICE_ID_NAMESPACE = '4b7e2725-dced-4244-b5f5-2221316d272c';
    const deviceId = uuidv5(machineId, DEVICE_ID_NAMESPACE);
    amplitude.getInstance().setDeviceId(deviceId);
  })
  .catch((err) => {
    captureException(err);
  });

export default amplitude;
