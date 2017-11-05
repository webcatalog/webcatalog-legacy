import React from 'react';
import PropTypes from 'prop-types';

import Button from 'material-ui/Button';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';

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
  formControl: {
    width: '100%',
  },
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formFooter: {
    alignSelf: 'flex-end',
    transform: 'translate(16px, 16px)',
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
    <div className={classes.root}>
      <div>
        <FormControl className={classes.formControl} error={currentPasswordError}>
          <InputLabel htmlFor="currentPassword">{STRING_CURRENT_PASSWORD}</InputLabel>
          <Input
            id="currentPassword"
            onChange={e => onFormUpdate({ currentPassword: e.target.value })}
            placeholder={STRING_CURRENT_PASSWORD_PLACEHOLDER}
            type="password"
            value={currentPassword}
          />
          {currentPasswordError ? <FormHelperText>{currentPasswordError}</FormHelperText> : null}
        </FormControl>
        <br />
        <br />
        <FormControl className={classes.formControl} error={passwordError}>
          <InputLabel htmlFor="password">{STRING_NEW_PASSWORD}</InputLabel>
          <Input
            id="password"
            onChange={e => onFormUpdate({ password: e.target.value })}
            placeholder={STRING_NEW_PASSWORD_PLACEHOLDER}
            type="password"
            value={password}
          />
          {passwordError ? <FormHelperText>{passwordError}</FormHelperText> : null}
        </FormControl>
        <br />
        <br />
        <FormControl className={classes.formControl} error={confirmPasswordError}>
          <InputLabel htmlFor="confirmPassword">{STRING_CONFIRM_NEW_PASSWORD}</InputLabel>
          <Input
            id="confirmPassword"
            onChange={e => onFormUpdate({ confirmPassword: e.target.value })}
            placeholder={STRING_CONFIRM_NEW_PASSWORD_PLACEHOLDER}
            type="password"
            value={confirmPassword}
          />
          {confirmPasswordError ? <FormHelperText>{confirmPasswordError}</FormHelperText> : null}
        </FormControl>
      </div>
      <div className={classes.formFooter}>
        <Button
          color="primary"
          disabled={isSaving}
          onClick={onSave}
        >
          {isSaving ? STRING_SAVING : STRING_SAVE}
        </Button>
      </div>
    </div>
  );
};

Password.defaultProps = {
};

Password.propTypes = {
  classes: PropTypes.object.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  confirmPasswordError: PropTypes.string.isRequired,
  currentPassword: PropTypes.string.isRequired,
  currentPasswordError: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
  password: PropTypes.string.isRequired,
  passwordError: PropTypes.string.isRequired,
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
