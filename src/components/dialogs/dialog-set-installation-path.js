import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import InputAdornment from '@material-ui/core/InputAdornment';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';

import connectComponent from '../../helpers/connect-component';

import {
  close,
  save,
  updateForm,
} from '../../state/dialog-set-installation-path/actions';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const { remote } = window.require('electron');

const styles = theme => ({
  top: {
    marginTop: theme.spacing.unit,
  },
  dialogActions: {
    borderTop: `1px solid ${theme.palette.divider}`,
    margin: 0,
    padding: theme.spacing.unit,
  },
});

const DialogSetInstallationPath = (props) => {
  const {
    classes,
    installationPath,
    onClose,
    onSave,
    onUpdateForm,
    open,
    requireAdmin,
  } = props;

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      onClose={onClose}
      open={open}
    >
      <EnhancedDialogTitle onClose={onClose}>
        Set Custom Installation Path
      </EnhancedDialogTitle>
      <DialogContent>
        <Typography align="center" variant="body1" className={classes.top}>
          Use at your own risk.
        </Typography>
        <TextField
          fullWidth
          id="installationPath"
          label="Installation path"
          margin="normal"
          value={installationPath}
          variant="outlined"
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  onClick={() => {
                    remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
                      properties: ['openDirectory'],
                    }, (filePaths) => {
                      if (!filePaths || filePaths.length < 1) return;
                      onUpdateForm({ installationPath: filePaths[0] });
                    });
                  }}
                >
                  Change
                </Button>
              </InputAdornment>
            ),
          }}
        />
        {window.process.platform !== 'win32' && (
          <FormControlLabel
            control={(
              <Checkbox
                checked={requireAdmin}
                onChange={e => onUpdateForm({ requireAdmin: e.target.checked })}
              />
            )}
            label="Require sudo for installation"
          />
        )}
      </DialogContent>
      <DialogActions className={classes.dialogActions}>
        <Button
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          onClick={onSave}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogSetInstallationPath.defaultProps = {
  installationPath: '~/Applications/WebCatalog Apps',
  requireAdmin: false,
};

DialogSetInstallationPath.propTypes = {
  classes: PropTypes.object.isRequired,
  installationPath: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onUpdateForm: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  requireAdmin: PropTypes.bool,
};

const mapStateToProps = (state) => {
  const {
    open,
    form: {
      installationPath,
      requireAdmin,
    },
  } = state.dialogSetInstallationPath;

  return {
    installationPath,
    requireAdmin,
    open,
  };
};

const actionCreators = {
  close,
  save,
  updateForm,
};

export default connectComponent(
  DialogSetInstallationPath,
  mapStateToProps,
  actionCreators,
  styles,
);
