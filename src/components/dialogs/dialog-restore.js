/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable object-curly-newline */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from 'jszip';
import { useDropzone } from 'react-dropzone';

import {
  Avatar,
  Button,
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

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import { close } from '../../state/dialog-restore/actions';
import getAssetPath from '../../helpers/get-asset';
import { APP_DETAILS_FILENAME, APP_IMAGES_FOLDERNAME } from '../../constants/backups';
import { requestInstallApp, requestInstallAppWithIconData } from '../../senders';
import getFilename from '../../helpers/get-filename';
import isCustomApp from '../../helpers/is-custom-app';

const useStyle = makeStyles((theme) => ({
  dialogBody: {
    display: 'inline-block',
  },
  dropZone: {
    border: '2px dashed',
    borderColor: theme.palette.divider,
    borderRadius: 5,
    background: theme.palette.background.default,
    height: 200,
    lineHeight: '160px',
    textAlign: 'center',
    color: theme.palette.text.disabled,
    userSelect: 'none',
    cursor: 'pointer',
    '&:hover': {
      borderColor: theme.palette.primary.main,
    },
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
  const onUploadAppDetailsZip = useCallback(async (assetPath) => {
    const filePath = getAssetPath(assetPath);

    // eslint-disable-next-line no-undef
    const fileResponse = await fetch(filePath);
    const fileBlob = await fileResponse.blob();

    const appDetailsContent = await JSZip.loadAsync(fileBlob);
    const appDetailsRes = await appDetailsContent.files[APP_DETAILS_FILENAME].async('text');
    const appDetailsData = JSON.parse(appDetailsRes)
      .map(([appKey, appInfo]) => {
        if (isCustomApp(appKey)) {
          return [appKey, appInfo];
        }
        return [appKey, {
          ...appInfo,
          icon: `https://cdn-1.webcatalog.io/catalog/${appKey}/${appKey}-icon-128.webp`,
        }];
      });

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
  }, []);
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

          requestInstallAppWithIconData(id, name, url, iconFilename, iconData, opts);
        } else {
          requestInstallApp(id, name, url, icon, opts);
        }
      }
    });
    resetDialogStates();

    onClose();
    window.ipcRenderer.emit('enqueue-snackbar', null, 'Restore successfully.', 'success');
  }, [selectedAppDetails, customAppsIconData, appDetails, installedApps, onClose]);

  const onAllAppSelected = () => {
    setAllAppSelected(!allAppsSelected);

    if (allAppsSelected) {
      setSelectedAppDetails([]);
    } else {
      setSelectedAppDetails([...Array(appDetails.length).keys()]);
    }
  };

  const { getRootProps, getInputProps } = useDropzone(({
    accept: 'application/zip, application/octet-stream, application/x-zip-compressed, multipart/x-zip',
    maxFiles: 1,
    onDrop: (files) => {
      if (files && files.length > 0) {
        onUploadAppDetailsZip(files[0].path);
      }
    },
  }));

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
          <div {...getRootProps({ className: classes.dropZone })}>
            <input {...getInputProps()} />
            <p>Drop backup ZIP file here or click to select.</p>
          </div>
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
