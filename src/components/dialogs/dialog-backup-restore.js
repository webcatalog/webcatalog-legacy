/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
/* eslint-disable object-curly-newline */
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
} from '@material-ui/core';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';
import { close } from '../../state/dialog-backup-restore/actions';
import { open as openDialogBackup } from '../../state/dialog-backup/actions';
import { open as openDialogRestore } from '../../state/dialog-restore/actions';

const DialogBackupRestore = () => {
  const dispatch = useDispatch();
  const onClose = useCallback(() => dispatch(close()), [dispatch]);
  const open = useSelector((state) => state.dialogBackupRestore.open);

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <EnhancedDialogTitle onClose={onClose}>
        Backup & Restore Apps & Spaces (ALPHA)
      </EnhancedDialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Backup only includes the list of your apps and spaces (including custom app icons)
          and does not include app data and preferences.
        </Typography>
        <List>
          <ListItem
            button
            onClick={() => {
              onClose();
              dispatch(openDialogBackup());
            }}
          >
            <ListItemIcon>
              <SvgIcon fontSize="large">
                <path fill="currentColor" d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C12.5,11 13,10.97 13.5,10.92V9.5H16.39L15.39,8.5L18.9,5C17.5,3.8 14.94,3 12,3M18.92,7.08L17.5,8.5L20,11H15V13H20L17.5,15.5L18.92,16.92L23.84,12M4,9V12C4,14.21 7.58,16 12,16C13.17,16 14.26,15.85 15.25,15.63L16.38,14.5H13.5V12.92C13,12.97 12.5,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C14.94,21 17.5,20.2 18.9,19L17,17.1C15.61,17.66 13.9,18 12,18C7.58,18 4,16.21 4,14Z" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText
              primary="Backup"
              secondary="Export list of apps & spaces to ZIP file."
            />
          </ListItem>
          <Divider />
          <ListItem
            button
            onClick={() => {
              onClose();
              dispatch(openDialogRestore());
            }}
          >
            <ListItemIcon>
              <SvgIcon fontSize="large">
                <path fill="currentColor" d="M12,3C8.59,3 5.69,4.07 4.54,5.57L9.79,10.82C10.5,10.93 11.22,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M3.92,7.08L2.5,8.5L5,11H0V13H5L2.5,15.5L3.92,16.92L8.84,12M20,9C20,11.21 16.42,13 12,13C11.34,13 10.7,12.95 10.09,12.87L7.62,15.34C8.88,15.75 10.38,16 12,16C16.42,16 20,14.21 20,12M20,14C20,16.21 16.42,18 12,18C9.72,18 7.67,17.5 6.21,16.75L4.53,18.43C5.68,19.93 8.59,21 12,21C16.42,21 20,19.21 20,17" />
              </SvgIcon>
            </ListItemIcon>
            <ListItemText
              primary="Restore"
              secondary="Import list of apps & spaces from ZIP file."
            />
          </ListItem>
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogBackupRestore;
