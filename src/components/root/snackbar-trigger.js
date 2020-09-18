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
