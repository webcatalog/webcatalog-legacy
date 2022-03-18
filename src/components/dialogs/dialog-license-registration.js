/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import {
  close,
  updateForm,
  register,
} from '../../state/dialog-license-registration/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import { requestOpenInBrowser } from '../../senders';

const useStyles = makeStyles((theme) => ({
  dialogContentText: {
    marginTop: theme.spacing(2),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  helpContent: {
    marginTop: theme.spacing(1),
    textAlign: 'right',
  },
}));

const DialogLicenseRegistration = () => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const open = useSelector((state) => state.dialogLicenseRegistration.open);
  const licenseKey = useSelector((state) => state.dialogLicenseRegistration.form.licenseKey);
  const licenseKeyError = useSelector(
    (state) => state.dialogLicenseRegistration.form.licenseKeyError,
  );

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={() => dispatch(close())}
      open={open}
    >
      <EnhancedDialogTitle onClose={() => dispatch(close())}>
        License Registration
      </EnhancedDialogTitle>
      <DialogContent>
        <DialogContentText className={classes.dialogContentText}>
          You are currently running the free version of WebCatalog which
          does not include&nbsp;
          <span
            onClick={() => requestOpenInBrowser('https://webcatalog.io/webcatalog-classic/pricing/?utm_source=webcatalog_app')}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser('https://webcatalog.io/webcatalog-classic/pricing/?utm_source=webcatalog_app');
            }}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            premium features
          </span>
          &nbsp;such as adding unlimited number of apps, spaces & accounts,
          blocking ads & trackers and more.
          To remove the limitations, please purchase WebCatalog Lifetime from our store.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id=""
          label="License Key"
          margin="normal"
          onChange={(e) => dispatch(updateForm({ licenseKey: e.target.value }))}
          value={licenseKey}
          placeholder="0-0000000000000-00000000-00000000-00000000-00000000"
          error={Boolean(licenseKeyError)}
          variant="outlined"
          helperText={licenseKeyError || 'If you have already purchased WebCatalog Lifetime from our store, you should have received a license key via email to enter above.'}
        />

        <DialogContentText className={classes.helpContent}>
          <Button
            onClick={() => requestOpenInBrowser('https://docs.webcatalog.io/article/9-i-lost-my-license-key-how-can-i-retrieve-it?utm_source=webcatalog_app')}
          >
            Lost your license key?
          </Button>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.io/webcatalog-classic/pricing/?utm_source=webcatalog_app')}
          >
            Purchase a License...
          </Button>
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.io/webcatalog-classic/pricing/?utm_source=webcatalog_app')}
          >
            Learn More...
          </Button>
        </div>
        <Button
          onClick={() => dispatch(close())}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={() => dispatch(register())}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogLicenseRegistration;
