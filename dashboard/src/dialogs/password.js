import React from 'react';
import PropTypes from 'prop-types';

import Divider from 'material-ui/Divider';
import Slide from 'material-ui/transitions/Slide';
import Dialog, {
  DialogActions,
  DialogContent,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import connectComponent from '../helpers/connect-component';

import {
  close,
  formUpdate,
  save,
} from '../state/dialogs/password/actions';
import {
  STRING_PASSWORD,
  STRING_CONFIRM_NEW_PASSWORD,
  STRING_CONFIRM_NEW_PASSWORD_PLACEHOLDER,
  STRING_CURRENT_PASSWORD,
  STRING_CURRENT_PASSWORD_PLACEHOLDER,
  STRING_NEW_PASSWORD,
  STRING_NEW_PASSWORD_PLACEHOLDER,
  STRING_SAVE,
  STRING_SAVING,
} from '../constants/strings';

import EnhancedDialogTitle from '../shared/enhanced-dialog-title';

const styles = theme => ({
  linearProgress: {
    opacity: 0,
  },
  toolbar: {
    padding: '0 12px',
  },
  dialogTitle: {
    borderBottom: `1px solid ${theme.palette.text.divider}`,
  },
  dialogContent: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 3,
    paddingRight: theme.spacing.unit * 3,
    minWidth: 320,
    boxSizing: 'border-box',
  },
  appBar: {
    position: 'relative',
    zIndex: 1,
  },
  textField: {
    width: '100%',
  },
  formControl: {
    width: '100%',
  },
});

const DialogPassword = (props) => {
  const {
    classes,
    onClose,
    open,
    confirmPassword,
    confirmPasswordError,
    currentPassword,
    currentPasswordError,
    password,
    passwordError,
    isSaving,
    onFormUpdate,
    onSave,
  } = props;

  return (
    <Dialog
      className={classes.root}
      onRequestClose={onClose}
      open={open}
      transition={<Slide direction="left" />}
    >
      <EnhancedDialogTitle onCloseButtonClick={onClose}>
        {STRING_PASSWORD}
      </EnhancedDialogTitle>
      <Divider />
      <DialogContent className={classes.dialogContent}>
        <TextField
          fullWidth
          disabled={isSaving}
          id="currentPassword"
          label={STRING_CURRENT_PASSWORD}
          margin="normal"
          onChange={e => onFormUpdate({ currentPassword: e.target.value })}
          placeholder={STRING_CURRENT_PASSWORD_PLACEHOLDER}
          value={currentPassword}
          error={currentPasswordError}
        />
        <TextField
          fullWidth
          disabled={isSaving}
          id="password"
          label={STRING_NEW_PASSWORD}
          margin="normal"
          onChange={e => onFormUpdate({ password: e.target.value })}
          placeholder={STRING_NEW_PASSWORD_PLACEHOLDER}
          value={password}
          error={passwordError}
        />
        <TextField
          fullWidth
          disabled={isSaving}
          id="confirmPassword"
          label={STRING_CONFIRM_NEW_PASSWORD}
          margin="normal"
          onChange={e => onFormUpdate({ confirmPassword: e.target.value })}
          placeholder={STRING_CONFIRM_NEW_PASSWORD_PLACEHOLDER}
          value={confirmPassword}
          error={confirmPasswordError}
        />
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          disabled={isSaving}
          onClick={onSave}
        >
          {isSaving ? STRING_SAVING : STRING_SAVE}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DialogPassword.defaultProps = {
  open: false,
};

DialogPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  confirmPasswordError: PropTypes.string.isRequired,
  currentPassword: PropTypes.string.isRequired,
  currentPasswordError: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
  open: PropTypes.bool,
  password: PropTypes.string.isRequired,
  passwordError: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => {
  const {
    open,
    form,
    isSaving,
  } = state.dialogs.password;

  const {
    confirmPassword,
    confirmPasswordError,
    currentPassword,
    currentPasswordError,
    password,
    passwordError,
  } = form;

  return {
    confirmPassword,
    confirmPasswordError,
    currentPassword,
    currentPasswordError,
    password,
    passwordError,
    isSaving,
    open,
  };
};

const actionCreators = {
  close,
  formUpdate,
  save,
};

export default connectComponent(
  DialogPassword,
  mapStateToProps,
  actionCreators,
  styles,
);
