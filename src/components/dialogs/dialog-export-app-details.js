/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import JSZip from 'jszip';
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
} from '@material-ui/core';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import { close } from '../../state/dialog-export-app-details/actions';
import getAssetPath from '../../helpers/get-asset';
import { APP_DETAILS_FILENAME, APP_IMAGES_FOLDERNAME } from '../../constants/backups';

const DialogExportAppDetails = () => {
  const dispatch = useDispatch();

  const [selectedApps, setSelectedApps] = useState([]);
  const [allAppsSelected, setAllAppsSelected] = useState(false);

  const open = useSelector((state) => state.dialogExportAppDetails.open);
  const appsList = useSelector((state) => Object.entries(state.appManagement.apps));

  const onClose = useCallback(() => dispatch(close()), [dispatch]);
  const onAppSelected = useCallback((appIndex) => () => {
    const currentAppIndex = selectedApps.indexOf(appIndex);
    const newSelectedApps = [...selectedApps];
    const isAllAppsSelected = (appsList.length === newSelectedApps.length);

    if (currentAppIndex === -1) {
      newSelectedApps.push(appIndex);
    } else {
      setAllAppsSelected(false);
      newSelectedApps.splice(currentAppIndex, 1);
    }

    setSelectedApps(newSelectedApps);
    setAllAppsSelected(isAllAppsSelected);
  }, [appsList, selectedApps]);
  const onExportAppDetails = useCallback(async () => {
    // TODO: Add zip utils for better architecture.
    const zip = new JSZip();
    zip.file(APP_DETAILS_FILENAME, JSON.stringify(appsList));

    const imagesFolder = zip.folder(APP_IMAGES_FOLDERNAME);
    const fileReader = new window.FileReader();

    appsList.forEach(([appKey, appInfo]) => {
      const { icon } = appInfo;
      const iconFileData = fileReader.readAsDataURL(new window.File(['icon'], icon));

      if (appKey.startsWith('custom-')) {
        imagesFolder.file(icon, iconFileData, { base64: true });
      }
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
    });
  }, [appsList]);

  const onAllAppSelected = () => {
    setAllAppsSelected(!allAppsSelected);

    if (allAppsSelected) {
      setSelectedApps([]);
    } else {
      setSelectedApps([...Array(appsList.length).keys()]);
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
        Backup Apps & Spaces
      </EnhancedDialogTitle>
      <DialogContent>
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
          {appsList && appsList.map(([appKey, appInfo], appIndex) => (
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
                  checked={selectedApps.indexOf(appIndex) !== -1}
                  onChange={onAppSelected(appIndex)}
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onExportAppDetails}
        >
          Export
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogExportAppDetails;
