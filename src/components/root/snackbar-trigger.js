/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import { useEffect } from 'react';

import { useSnackbar } from 'notistack';

const SnackbarTrigger = () => {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    window.ipcRenderer.removeAllListeners('enqueue-snackbar');
    window.ipcRenderer.on('enqueue-snackbar', (_, message, variant) => {
      enqueueSnackbar(message, { variant, autoHideDuration: 10000 });
    });
    return () => {
      window.ipcRenderer.removeAllListeners('enqueue-snackbar');
    };
  }, [enqueueSnackbar]);

  return null;
};

export default SnackbarTrigger;
