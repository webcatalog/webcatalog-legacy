/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable object-curly-newline */
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from 'jszip';

import {
  Avatar,
  Button,
  ButtonBase,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
  makeStyles,
} from '@material-ui/core';
import FolderIcon from '@material-ui/icons/FolderOpenOutlined';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import { close } from '../../state/dialog-restore/actions';
import getAssetPath from '../../helpers/get-asset';
import { APP_DETAILS_FILENAME, APP_IMAGES_FOLDERNAME } from '../../constants/backups';
import { requestInstallApp, requestInstallCustomApp } from '../../senders';
import getFilename from '../../helpers/get-filename';
import isCustomApp from '../../helpers/is-custom-app';

const useStyle = makeStyles(() => ({
  dialogBody: {
    display: 'inline-block',
  },
  uploadFile: {
    height: '240px',
    width: '100%',
  },
  uploadFileIcon: {
    fontSize: 64,
  },
}));

const DialogRestore = () => {
  const dispatch = useDispatch();
  const classes = useStyle();

  const open = useSelector((state) => state.dialogRestore.open);
  const installedApps = useSelector((state) => state.installed.filteredSortedAppIds
    || state.appManagement.sortedAppIds);

  const [appDetails, updateAppDetails] = useState([]);
  const [customAppsIconData, updateCustomAppsIconData] = useState({});
  const [selectedAppDetails, setSelectedAppDetails] = useState([]);
  const [allAppsSelected, setAllAppSelected] = useState(false);
  const resetDialogStates = () => {
    updateAppDetails([]);
    updateCustomAppsIconData({});
    setSelectedAppDetails([]);
    setAllAppSelected(false);
  };

  const onClose = useCallback(() => dispatch(close()), [dispatch]);
  const onUploadAppDetailsZip = useCallback(async () => {
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
      const appDetailsRes = await appDetailsContent.files[APP_DETAILS_FILENAME].async('text');
      const appDetailsData = JSON.parse(appDetailsRes);

      // Caching custom app images
      const appIconsData = await Promise.all(appDetailsData.map(async ([appKey, appInfo]) => {
        if (isCustomApp(appKey)) {
          const { name, icon } = appInfo;
          const iconFilename = `${name}-${getFilename(icon)}`;
          const iconFilePath = `${APP_IMAGES_FOLDERNAME}/${iconFilename}`;
          const iconData = await appDetailsContent.files[iconFilePath].async('uint8array');

          return { [appKey]: { iconFilename, iconData } };
        }

        return { };
      }));

      let newAppIconsData = { };
      appIconsData.forEach((iconsData) => {
        newAppIconsData = { ...newAppIconsData, ...iconsData };
      });

      updateCustomAppsIconData(newAppIconsData);
      updateAppDetails(appDetailsData);
    }
  }, [appDetails, customAppsIconData]);
  const onAppSelected = useCallback((appIndex) => () => {
    const currentAppIndex = selectedAppDetails.indexOf(appIndex);
    const newSelectedApps = [...selectedAppDetails];
    const isAllAppsSelected = (appDetails.length === newSelectedApps.length);

    if (currentAppIndex === -1) {
      newSelectedApps.push(appIndex);
    } else {
      setAllAppSelected(false);
      newSelectedApps.splice(currentAppIndex, 1);
    }

    setSelectedAppDetails(newSelectedApps);
    setAllAppSelected(isAllAppsSelected);
  }, [appDetails, selectedAppDetails]);
  const onRequestRestoreApp = useCallback(() => {
    const selectedAppsData = appDetails
      .filter((_, index) => selectedAppDetails.indexOf(index) !== -1)
      .map(([appKey, appInfo]) => {
        const { id, name, url, icon, opts } = appInfo;

        return [appKey, { id, name, url, icon, opts }];
      });

    selectedAppsData.forEach(([appKey, appInfo]) => {
      const { id, name, url, icon, opts } = appInfo;

      if (!installedApps.includes(appKey)) {
        if (isCustomApp(appKey)) {
          const { iconFilename, iconData } = customAppsIconData[appKey];

          requestInstallCustomApp(id, name, url, iconFilename, iconData, opts);
        } else {
          requestInstallApp(id, name, url, icon, opts);
        }
      }
    });
    resetDialogStates();

    onClose();
  }, [selectedAppDetails, customAppsIconData]);

  const onAllAppSelected = () => {
    setAllAppSelected(!allAppsSelected);

    if (allAppsSelected) {
      setSelectedAppDetails([]);
    } else {
      setSelectedAppDetails([...Array(appDetails.length).keys()]);
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
      <DialogContent className={classes.dialogBody}>
        {appDetails.length ? (
          <>
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Choose which apps & spaces to restore.
            </Typography>
            <List>
              <ListItem
                button
                dense
                onClick={onAllAppSelected}
              >
                <ListItemText primary="All Apps & Spaces" />
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    color="primary"
                    tabIndex={-1}
                    disableRipple
                    checked={allAppsSelected}
                    onChange={onAllAppSelected}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              {appDetails && appDetails.map(([appKey, appInfo], appIndex) => (
                <ListItem
                  button
                  dense
                  key={appKey}
                  onClick={onAppSelected(appIndex)}
                >
                  <ListItemAvatar>
                    <Avatar src={getAssetPath(appInfo.icon)} />
                  </ListItemAvatar>
                  <ListItemText
                    id={appKey}
                    primary={appInfo.name}
                  />
                  <ListItemSecondaryAction>
                    <Checkbox
                      edge="end"
                      color="primary"
                      tabIndex={-1}
                      disableRipple
                      checked={selectedAppDetails.indexOf(appIndex) !== -1}
                      onChange={onAppSelected(appIndex)}
                    />
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </>
        ) : (
          <ButtonBase
            className={classes.uploadFile}
            onClick={onUploadAppDetailsZip}
          >
            <FolderIcon className={classes.uploadFileIcon} />
            Choose ZIP file to restore.
          </ButtonBase>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          disabled={!appDetails.length || !selectedAppDetails.length}
          onClick={onRequestRestoreApp}
        >
          Restore
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogRestore;
