import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import {
  DialogActions,
  DialogContent,
} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';

import connectComponent from '../../helpers/connect-component';

import {
  formUpdate,
  save,
} from '../../actions/dialogs/account/password/actions';

import {
  STRING_CONFIRM_NEW_PASSWORD,
  STRING_CONFIRM_NEW_PASSWORD_PLACEHOLDER,
  STRING_CURRENT_PASSWORD,
  STRING_CURRENT_PASSWORD_PLACEHOLDER,
  STRING_NEW_PASSWORD,
  STRING_NEW_PASSWORD_PLACEHOLDER,
  STRING_SAVE,
  STRING_SAVING,
} from '../../constants/strings';

const styles = {
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
};

const Password = (props) => {
  const {
    classes,
    confirmPassword,
    confirmPasswordError,
    currentPassword,
    currentPasswordError,
    isSaving,
    onFormUpdate,
    onSave,
    password,
    passwordError,
  } = props;

  return (
    <div>
      <DialogContent className={classes.dialogContent}>
        <TextField
          fullWidth
          disabled={isSaving}
          id="currentPassword"
          label={currentPasswordError || STRING_CURRENT_PASSWORD}
          margin="normal"
          onChange={e => onFormUpdate({ currentPassword: e.target.value })}
          placeholder={STRING_CURRENT_PASSWORD_PLACEHOLDER}
          value={currentPassword}
          error={Boolean(currentPasswordError)}
        />
        <TextField
          fullWidth
          disabled={isSaving}
          id="password"
          label={passwordError || STRING_NEW_PASSWORD}
          margin="normal"
          onChange={e => onFormUpdate({ password: e.target.value })}
          placeholder={STRING_NEW_PASSWORD_PLACEHOLDER}
          value={password}
          error={Boolean(passwordError)}
        />
        <TextField
          fullWidth
          disabled={isSaving}
          id="confirmPassword"
          label={confirmPasswordError || STRING_CONFIRM_NEW_PASSWORD}
          margin="normal"
          onChange={e => onFormUpdate({ confirmPassword: e.target.value })}
          placeholder={STRING_CONFIRM_NEW_PASSWORD_PLACEHOLDER}
          value={confirmPassword}
          error={Boolean(confirmPasswordError)}
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
    </div>
  );
};

Password.defaultProps = {
  confirmPasswordError: null,
  currentPasswordError: null,
  passwordError: null,
};

Password.propTypes = {
  classes: PropTypes.object.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  confirmPasswordError: PropTypes.string,
  currentPassword: PropTypes.string.isRequired,
  currentPasswordError: PropTypes.string,
  isSaving: PropTypes.bool.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  password: PropTypes.string.isRequired,
  passwordError: PropTypes.string,
};

const mapStateToProps = (state) => {
  const {
    confirmPassword,
    confirmPasswordError,
    currentPassword,
    currentPasswordError,
    password,
    passwordError,
  } = state.dialogs.account.password.form;

  const { isSaving } = state.dialogs.account.password;

  return {
    confirmPassword,
    confirmPasswordError,
    currentPassword,
    currentPasswordError,
    isSaving,
    password,
    passwordError,
  };
};

const actionCreators = {
  formUpdate,
  save,
};

export default connectComponent(
  Password,
  mapStateToProps,
  actionCreators,
  styles,
);
