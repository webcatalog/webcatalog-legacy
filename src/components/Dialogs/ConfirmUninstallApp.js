import React from 'react';

import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Button from 'material-ui/Button';
import Fade from 'material-ui/transitions/Fade';
import Slide from 'material-ui/transitions/Slide';
import { LinearProgress } from 'material-ui/Progress';
import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'material-ui/Dialog';

import {
  close,
  save,
} from '../../actions/dialogs/confirm-uninstall-app';

const styleSheet = createStyleSheet('ConfirmUninstallApp', {
  linearProgress: {
    opacity: 0,
  },
  dialogContent: {
    maxWidth: 288,
  },
  title: {
    marginRight: 24,
  },
});

const ConfirmUninstallApp = (props) => {
  const {
    appName,
    isSaving,
    classes,
    onSave,
    onClose,
    open,
  } = props;

  const saveButtonText = isSaving ? 'Uninstalling...' : 'Uninstall';

  return (
    <Dialog
      ignoreBackdropClick={isSaving}
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={Slide}
    >
      <Fade in={isSaving}>
        <LinearProgress className={classes.linearProgress} />
      </Fade>

      <DialogTitle className={classes.title}>Uninstall {appName}?</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <DialogContentText>
          All of your browsing data for {appName} will be removed and can&apos;t be recovered.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          disabled={isSaving}
          color="primary"
          onClick={onSave}
        >
          {saveButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ConfirmUninstallApp.defaultProps = {
  open: false,
};

ConfirmUninstallApp.propTypes = {
  classes: PropTypes.object.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  appName: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    isSaving,
    open,
    form,
  } = state.dialogs.confirmUninstallApp;

  const { appName } = form;

  return {
    isSaving,
    open,
    appName,
  };
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(close()),
  onSave: () => dispatch(save()),
});

export default
  connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(ConfirmUninstallApp));
