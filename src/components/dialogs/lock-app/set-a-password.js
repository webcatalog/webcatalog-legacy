import React from 'react';
import PropTypes from 'prop-types';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import connectComponent from '../../../helpers/connect-component';

import {
  close,
  formUpdate,
  save,
} from '../../../state/dialogs/lock-app/actions';

import {
  STRING_CANCEL,
  STRING_SAVE,
  STRING_CONFIRM_PASSWORD,
  STRING_PASSWORD,
  STRING_SET_A_PASSWORD,
} from '../../../constants/strings';

const styles = {
  content: {
    minWidth: 320,
  },
};

const SetAPassword = (props) => {
  const {
    classes,
    confirmPassword,
    confirmPasswordErr,
    onClose,
    onFormUpdate,
    onSave,
    password,
    passwordErr,
  } = props;

  return (
    <React.Fragment>
      <DialogContent className={classes.content}>
        <Typography variant="body1">
          {STRING_SET_A_PASSWORD}
        </Typography>
        <TextField
          error={Boolean(passwordErr)}
          label={STRING_PASSWORD}
          fullWidth
          margin="normal"
          onChange={e => onFormUpdate({ password: e.target.value })}
          value={password}
          helperText={passwordErr}
          type="password"
        />
        <TextField
          error={Boolean(confirmPasswordErr)}
          label={STRING_CONFIRM_PASSWORD}
          fullWidth
          margin="normal"
          onChange={e => onFormUpdate({ confirmPassword: e.target.value })}
          value={confirmPassword}
          helperText={confirmPasswordErr}
          type="password"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          {STRING_CANCEL}
        </Button>
        <Button
          color="primary"
          onClick={onSave}
        >
          {STRING_SAVE}
        </Button>
      </DialogActions>
    </React.Fragment>
  );
};

SetAPassword.propTypes = {
  classes: PropTypes.object.isRequired,
  confirmPassword: PropTypes.string,
  confirmPasswordErr: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onFormUpdate: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  password: PropTypes.string,
  passwordErr: PropTypes.string,
};

SetAPassword.defaultProps = {
  confirmPassword: '',
  confirmPasswordErr: null,
  password: '',
  passwordErr: null,
};

const mapStateToProps = state => ({
  confirmPassword: state.dialogs.lockApp.form.confirmPassword,
  confirmPasswordErr: state.dialogs.lockApp.form.confirmPasswordErr,
  password: state.dialogs.lockApp.form.password,
  passwordErr: state.dialogs.lockApp.form.passwordErr,
});

const actionCreators = {
  close,
  formUpdate,
  save,
};

export default connectComponent(
  SetAPassword,
  mapStateToProps,
  actionCreators,
  styles,
);
