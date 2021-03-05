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
  helpContent: {
    marginTop: theme.spacing(1),
    textAlign: 'right',
  },
});

const DialogLicenseRegistration = ({
  classes,
  licenseKey,
  licenseKeyError,
  onClose,
  onRegister,
  onUpdateForm,
  open,
  verifying,
}) => (
  <Dialog
    fullWidth
    maxWidth="sm"
    onClose={onClose}
    open={open}
  >
    <EnhancedDialogTitle onClose={onClose}>
      Legacy License Registration
    </EnhancedDialogTitle>
    <DialogContent>
      <DialogContentText className={classes.dialogContentText}>
        If you&apos;ve purchased or received a lifetime WebCatalog or Singlebox license key,
        you can use it to upgrade your account to WebCatalog
        Lifetime Plan.
        <br />
        <br />
        WebCatalog
        Lifetime Plan lets you use many premium features and
        add unlimited number of apps & workspaces perpetually.
        <br />
        <br />
        The license key
        will be tied to this account.
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
        helperText={licenseKeyError || 'If you\'ve already purchased a lifetime license, you should have received the license key via email to enter above.'}
      />

      <DialogContentText className={classes.helpContent}>
        <Button
          variant="text"
          color="default"
          onClick={() => requestOpenInBrowser('https://help.webcatalog.app/article/9-i-lost-my-license-key-how-can-i-retrieve-it?utm_source=webcatalog_app')}
        >
          Lost your license key?
        </Button>
      </DialogContentText>
    </DialogContent>
    <DialogActions className={classes.dialogActions}>
      <div style={{ flex: 1 }}>
        <Button
          onClick={() => requestOpenInBrowser('https://webcatalog.app/pricing?utm_source=webcatalog_app')}
        >
          Buy License...
        </Button>
      </div>
      <Button
        onClick={onClose}
        disabled={verifying}
      >
        Cancel
      </Button>
      <Button
        color="primary"
        onClick={onRegister}
        disabled={Boolean(licenseKeyError) || verifying}
      >
        {verifying ? 'Verifying...' : 'Activate'}
      </Button>
    </DialogActions>
  </Dialog>
);

DialogLicenseRegistration.defaultProps = {
  licenseKey: '',
  licenseKeyError: null,
  verifying: false,
};

DialogLicenseRegistration.propTypes = {
  classes: PropTypes.object.isRequired,
  licenseKey: PropTypes.string,
  licenseKeyError: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onRegister: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  verifying: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const {
    open,
    verifying,
    form: {
      licenseKey,
      licenseKeyError,
    },
  } = state.dialogLicenseRegistration;

  return {
    licenseKey,
    licenseKeyError,
    open,
    verifying,
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
