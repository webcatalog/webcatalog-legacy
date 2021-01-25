/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  updateForm,
  register,
} from '../../state/dialog-license-registration/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

import { requestOpenInBrowser } from '../../senders';

const styles = (theme) => ({
  dialogContentText: {
    marginTop: theme.spacing(2),
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing(1),
  },
  link: {
    fontWeight: 600,
    cursor: 'pointer',
    outline: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  helpContent: {
    marginTop: theme.spacing(1),
    textAlign: 'right',
  },
});

const DialogLicenseRegistration = (props) => {
  const {
    classes,
    licenseKey,
    licenseKeyError,
    onClose,
    onUpdateForm,
    onRegister,
    open,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        License Registration
      </EnhancedDialogTitle>
      <DialogContent>
        <DialogContentText className={classes.dialogContentText}>
          You are currently running the free version of WebCatalog which
          does not include&nbsp;
          <span
            onClick={() => requestOpenInBrowser('https://webcatalog.app/pricing?utm_source=webcatalog_app')}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser('https://webcatalog.app/pricing?utm_source=webcatalog_app');
            }}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            premium features
          </span>
          &nbsp;such as adding unlimited number of workspaces,
          blocking ads & trackers and more.
          To remove the limitations, please purchase WebCatalog Plus (30 USD) from our store.
        </DialogContentText>
        <TextField
          autoFocus
          fullWidth
          id=""
          label="License Key"
          margin="normal"
          onChange={(e) => onUpdateForm({ licenseKey: e.target.value })}
          value={licenseKey}
          placeholder="0-0000000000000-00000000-00000000-00000000-00000000"
          error={Boolean(licenseKeyError)}
          variant="outlined"
          helperText={licenseKeyError || 'If you have already purchased WebCatalog Plus or Singlebox from our store, you should have received a license key via email to enter above.'}
        />

        <DialogContentText className={classes.helpContent}>
          <span
            onClick={() => requestOpenInBrowser('https://help.webcatalog.app/article/9-i-lost-my-license-key-how-can-i-retrieve-it?utm_source=webcatalog_app')}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              requestOpenInBrowser('https://help.webcatalog.app/article/9-i-lost-my-license-key-how-can-i-retrieve-it?utm_source=webcatalog_app');
            }}
            role="link"
            tabIndex="0"
            className={classes.link}
          >
            Lost your license key?
          </span>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.onfastspring.com/webcatalog-lite?utm_source=webcatalog_app')}
          >
            Visit Store...
          </Button>
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.app/pricing?utm_source=webcatalog_app')}
          >
            Learn More...
          </Button>
        </div>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onRegister}
        >
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogLicenseRegistration.defaultProps = {
  licenseKey: '',
  licenseKeyError: null,
};

DialogLicenseRegistration.propTypes = {
  classes: PropTypes.object.isRequired,
  licenseKey: PropTypes.string,
  licenseKeyError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      licenseKey,
      licenseKeyError,
    },
  } = state.dialogLicenseRegistration;

  return {
    licenseKey,
    licenseKeyError,
    open,
  };
};

const actionCreators = {
  close,
  updateForm,
  register,
};

export default connectComponent(
  DialogLicenseRegistration,
  mapStateToProps,
  actionCreators,
  styles,
);
