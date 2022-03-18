/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useEffect } from 'react';

import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core';

import TelemetryManager from './root/telemetry-manager';
import Container from './root/container';

import DialogAbout from './dialogs/dialog-about';
import DialogCatalogAppDetails from './dialogs/dialog-catalog-app-details';
import DialogCreateCustomApp from './dialogs/dialog-create-custom-app';
import DialogEditApp from './dialogs/dialog-edit-app';
import DialogBackupRestore from './dialogs/dialog-backup-restore';
import DialogBackup from './dialogs/dialog-backup';
import DialogRestore from './dialogs/dialog-restore';
import DialogLicenseRegistration from './dialogs/dialog-license-registration';
import DialogOpenSourceNotices from './dialogs/dialog-open-source-notices';
import DialogSetInstallationPath from './dialogs/dialog-set-installation-path';
import SnackbarTrigger from './root/snackbar-trigger';

import {
  requestGetInstalledApps,
  requestCheckForUpdates,
} from '../senders';

import { fetchLatestTemplateVersionAsync } from '../state/general/actions';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
    width: '100vw',
    background: theme.palette.background.default,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  notistackContainerRoot: {
    // substract 22px of FakeTitleBar
    marginTop: window.process.platform === 'darwin' && window.mode !== 'menubar' ? 64 : 42,
  },
}));

const App = () => {
  const dispatch = useDispatch();
  const classes = useStyles();

  useEffect(() => {
    requestCheckForUpdates(true); // isSilent = true
    requestGetInstalledApps();

    dispatch(fetchLatestTemplateVersionAsync());
    const updaterTimer = setTimeout(() => {
      dispatch(fetchLatestTemplateVersionAsync());
    }, 15 * 60 * 1000); // recheck every 15 minutes
    return () => {
      clearTimeout(updaterTimer);
    };
  }, [dispatch]);

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <Container />
      </div>

      <SnackbarTrigger />
      <TelemetryManager />

      <DialogAbout />
      <DialogCatalogAppDetails />
      <DialogCreateCustomApp />
      <DialogEditApp />
      <DialogBackupRestore />
      <DialogBackup />
      <DialogRestore />
      <DialogLicenseRegistration />
      <DialogOpenSourceNotices />
      <DialogSetInstallationPath />
    </div>
  );
};

export default App;
