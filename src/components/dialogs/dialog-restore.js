/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable object-curly-newline */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from 'jszip';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
} from '@material-ui/core';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import { close } from '../../state/dialog-restore/actions';
import getAssetPath from '../../helpers/get-asset';
import { APP_DETAILS_FILENAME, APP_IMAGES_FOLDERNAME } from '../../constants/backups';
import { requestInstallApp, requestInstallCustomApp } from '../../senders';
import getFilename from '../../helpers/get-filename';

const DialogRestore = () => {
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogRestore.open);

  const onClose = useCallback(() => dispatch(close()), [dispatch]);

  const onUploadAppDetailsZip = async () => {
    const filePaths = window.remote.dialog.showOpenDialogSync({
      filters: [
        { name: 'App Details', extensions: ['.zip'] },
      ],
      properties: ['openFile'],
    });

    if (filePaths && filePaths.length !== 0) {
      const filePath = getAssetPath(filePaths[0]);

      // eslint-disable-next-line no-undef
      const fileResponse = await fetch(filePath);
      const fileBlob = await fileResponse.blob();

      const appDetailsContent = await JSZip.loadAsync(fileBlob);
      const appDetailsData = await appDetailsContent.files[APP_DETAILS_FILENAME].async('text');
      const appDetails = JSON.parse(appDetailsData);

      appDetails.forEach(async ([appKey, appInfo]) => {
        if (appKey.startsWith('custom-')) {
          const { id, name, url, icon, opts } = appInfo;
          const iconFilename = `${name}-${getFilename(icon)}`;
          const iconFilePath = `${APP_IMAGES_FOLDERNAME}/${iconFilename}`;
          const iconData = await appDetailsContent.files[iconFilePath].async('uint8array');

          requestInstallCustomApp(id, name, url, iconFilename, iconData, opts);
        } else {
          const { id, name, url, icon, opts } = appInfo;

          requestInstallApp(id, name, url, icon, opts);
        }
      });
    }
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <EnhancedDialogTitle onClose={onClose}>
        Restore Apps & Spaces
      </EnhancedDialogTitle>
      <DialogContent>
        <Button
          variant="contained"
          size="large"
          onClick={onUploadAppDetailsZip}
        >
          Choose ZIP file
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRestore;
