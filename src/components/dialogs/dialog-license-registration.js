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

const styles = theme => ({
  dialogContentText: {
    marginTop: theme.spacing.unit * 2,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
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
      maxWidth="xs"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        License Registration
      </EnhancedDialogTitle>
      <DialogContent>
        <DialogContentText className={classes.dialogContentText}>
          You are currently running a trial version of WebCatalog.
           To remove the trial limitations, please purchase a license key from our store.
        </DialogContentText>
        <TextField
          fullWidth
          id=""
          label={licenseKeyError || 'License Key'}
          margin="normal"
          onChange={e => onUpdateForm({ licenseKey: e.target.value })}
          value={licenseKey}
          placeholder="0-0000000000000-00000000-00000000-00000000-00000000"
          error={Boolean(licenseKeyError)}
          variant="outlined"
          helperText="If you have already purchased WebCatalog from our store, you should have received a license key via email to enter above."
        />
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <div style={{ flex: 1 }}>
          <Button
            onClick={() => requestOpenInBrowser('https://webcatalog.onfastspring.com/webcatalog-lite')}
          >
            Visit Store...
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
