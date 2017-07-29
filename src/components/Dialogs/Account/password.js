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
    oldPassword,
    newPassword,
    confirmNewPassword,
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
          id="oldPassword"
          label="Old Password"
          marginForm
          onChange={e => onFormUpdate({ oldPassword: e.target.value })}
          placeholder="Enter your current password"
          value={oldPassword}
        />
        <br />
        <br />
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="newPassword"
          label="New Password"
          marginForm
          onChange={e => onFormUpdate({ newPassword: e.target.value })}
          placeholder="Enter your new password"
          value={newPassword}
        />
        <br />
        <br />
        <TextField
          className={classes.textField}
          disabled={isSaving}
          id="confirmNewPassword"
          label="Confirm New Password"
          marginForm
          onChange={e => onFormUpdate({ confirmNewPassword: e.target.value })}
          placeholder="Confirm your new password"
          value={confirmNewPassword}
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
  oldPassword: PropTypes.string.isRequired,
  isSaving: PropTypes.bool.isRequired,
  newPassword: PropTypes.string.isRequired,
  confirmNewPassword: PropTypes.string.isRequired,
  onFormUpdate: PropTypes.bool.isRequired,
  onSave: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => {
  const {
    oldPassword,
    newPassword,
    confirmNewPassword,
  } = state.ui.dialogs.account.password.form;

  const { isSaving } = state.ui.dialogs.account.password;

  return {
    oldPassword,
    newPassword,
    confirmNewPassword,
    isSaving,
  };
};

const mapDispatchToProps = dispatch => ({
  onFormUpdate: changes => dispatch(formUpdate(changes)),
  onSave: () => dispatch(save()),
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Password));
