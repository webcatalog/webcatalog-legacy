import React from 'react';

import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';
import Input from 'material-ui/Input';
import InputLabel from 'material-ui/Input/InputLabel';
import FormControl from 'material-ui/Form/FormControl';
import FormHelperText from 'material-ui/Form/FormHelperText';

import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';

import {
  formUpdate,
  save,
} from '../../../state/ui/dialogs/account/password/actions';

const styleSheet = createStyleSheet('Password', {
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
});

const Password = (props) => {
  const {
    classes,
    isSaving,
    currentPassword,
    currentPasswordError,
    password,
    passwordError,
    confirmPassword,
    confirmPasswordError,
    onFormUpdate,
    onSave,
  } = props;

  return (
    <div className={classes.root}>
      <div>
        <FormControl className={classes.formControl} error={currentPasswordError}>
          <InputLabel htmlFor="currentPassword">Current Password</InputLabel>
          <Input
            type="password"
            id="currentPassword"
            value={currentPassword}
            onChange={e => onFormUpdate({ currentPassword: e.target.value })}
          />
          {currentPasswordError ? <FormHelperText>{currentPasswordError}</FormHelperText> : null}
        </FormControl>
        <br />
        <br />
        <FormControl className={classes.formControl} error={passwordError}>
          <InputLabel htmlFor="password">New Password</InputLabel>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={e => onFormUpdate({ password: e.target.value })}
          />
          {passwordError ? <FormHelperText>{passwordError}</FormHelperText> : null}
        </FormControl>
        <br />
        <br />
        <FormControl className={classes.formControl} error={confirmPasswordError}>
          <InputLabel htmlFor="confirmPassword">Confirm New Password</InputLabel>
          <Input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={e => onFormUpdate({ confirmPassword: e.target.value })}
          />
          {confirmPasswordError ? <FormHelperText>{confirmPasswordError}</FormHelperText> : null}
        </FormControl>
      </div>
      <div className={classes.formFooter}>
        <Button
          disabled={isSaving}
          color="primary"
          onClick={onSave}
        >
          {isSaving ? <CircularProgress size={24} /> : 'Save'}
        </Button>
      </div>
    </div>
  );
};

Password.defaultProps = {
};

Password.propTypes = {
  classes: PropTypes.object.isRequired,
  currentPassword: PropTypes.string.isRequired,
  currentPasswordError: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  password: PropTypes.string.isRequired,
  passwordError: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  confirmPasswordError: PropTypes.string.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    currentPassword,
    currentPasswordError,
    password,
    passwordError,
    confirmPassword,
    confirmPasswordError,
  } = state.ui.dialogs.account.password.form;

  const { isSaving } = state.ui.dialogs.account.password;

  return {
    currentPassword,
    currentPasswordError,
    password,
    passwordError,
    confirmPassword,
    confirmPasswordError,
    isSaving,
  };
};

const mapDispatchToProps = dispatch => ({
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Password));
