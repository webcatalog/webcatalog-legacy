import React from 'react';

import PropTypes from 'prop-types';
import Button from 'material-ui/Button';
import { connect } from 'react-redux';
import { CircularProgress } from 'material-ui/Progress';

import TextField from 'material-ui/TextField';

import {
  createStyleSheet,
  withStyles,
} from 'material-ui/styles';

import {
  formUpdate,
  save,
} from '../../../state/ui/dialogs/account/password/actions';

const styleSheet = createStyleSheet('Password', {
  textField: {
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
    password,
    confirmPassword,
    onFormUpdate,
    onSave,
  } = props;

  return (
    <div className={classes.root}>
      <div>
        <TextField
          autoFocus
          className={classes.textField}
          disabled={isSaving}
          id="currentPassword"
          label="Current password"
          marginForm
          onChange={e => onFormUpdate({ currentPassword: e.target.value })}
          placeholder="Enter your current password"
          value={currentPassword}
        />
        <br />
        <br />
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="password"
          label="New Password"
          marginForm
          onChange={e => onFormUpdate({ password: e.target.value })}
          placeholder="Enter your new password"
          value={password}
        />
        <br />
        <br />
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="confirmPassword"
          label="Confirm New Password"
          marginForm
          onChange={e => onFormUpdate({ confirmPassword: e.target.value })}
          placeholder="Confirm your new password"
          value={confirmPassword}
        />
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
  isSaving: PropTypes.bool.isRequired,
  password: PropTypes.string.isRequired,
  confirmPassword: PropTypes.string.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    currentPassword,
    password,
    confirmPassword,
  } = state.ui.dialogs.account.password.form;

  const { isSaving } = state.ui.dialogs.account.password;

  return {
    currentPassword,
    password,
    confirmPassword,
    isSaving,
  };
};

const mapDispatchToProps = dispatch => ({
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Password));
